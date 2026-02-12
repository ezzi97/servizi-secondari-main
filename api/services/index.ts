const { handleCors } = require('../utils/cors');
const { getAuthUser } = require('../utils/auth');
const { getSupabaseAdmin } = require('../utils/supabase');
const { mapServiceRow, mapChildToDb, childTable } = require('../utils/service-mapper');

function extractPrice(type: string, data: Record<string, any>): number {
  return type === 'sport' ? (data.priceSport ?? 0) : (data.price ?? 0);
}

function extractKilometers(type: string, data: Record<string, any>): number {
  return type === 'sport' ? (data.kilometersSport ?? 0) : (data.kilometers ?? 0);
}

function extractServiceDate(type: string, data: Record<string, any>): string | null {
  return type === 'sport' ? (data.eventDateSport ?? null) : (data.serviceDate ?? null);
}

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Non autorizzato' });
  }

  const supabase = getSupabaseAdmin();

  // ---- GET: list services with nested child data ----
  if (req.method === 'GET') {
    const {
      type, status, dateFrom, dateTo, search,
      page = '1', pageSize = '20',
      sortBy = 'service_date', sortOrder = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const size = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
    const from = (pageNum - 1) * size;
    const to = from + size - 1;

    // Nested select pulls child tables automatically (1:1 relationships)
    let query = supabase
      .from('services')
      .select('*, secondary_services(*), event_services(*)', { count: 'exact' });

    if (user.role !== 'admin' && user.role !== 'operator') {
      query = query.eq('user_id', user.id);
    }

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);
    if (dateFrom) query = query.gte('service_date', dateFrom);
    if (dateTo) query = query.lte('service_date', dateTo);

    const validSortColumns = ['created_at', 'updated_at', 'status', 'type', 'price', 'kilometers', 'service_date'];
    const sortCol = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    query = query.order(sortCol, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const items = (data || []).map(mapServiceRow);
    const total = count || 0;

    return res.status(200).json({
      success: true,
      data: {
        items, total,
        page: pageNum, pageSize: size,
        totalPages: Math.ceil(total / size),
      },
    });
  }

  // ---- POST: create service (parent + child in two steps) ----
  if (req.method === 'POST') {
    const body = req.body || {};
    const { type: serviceType, status: serviceStatus = 'draft', ...formData } = body;

    if (!serviceType || !['sport', 'secondary'].includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Il tipo di servizio è obbligatorio (sport o secondary)',
      });
    }

    const km = extractKilometers(serviceType, formData);
    const price = extractPrice(serviceType, formData);
    const serviceDate = extractServiceDate(serviceType, formData);

    // 1. Insert parent row
    const { data: parentRow, error: parentError } = await supabase
      .from('services')
      .insert({
        type: serviceType,
        user_id: user.id,
        status: serviceStatus,
        service_date: serviceDate,
        kilometers: km,
        price,
      })
      .select()
      .single();

    if (parentError) {
      return res.status(500).json({ success: false, message: parentError.message });
    }

    // 2. Insert child row
    const childData = mapChildToDb(serviceType, formData);
    const table = childTable(serviceType);

    const { error: childError } = await supabase
      .from(table)
      .insert({ service_id: parentRow.id, ...childData });

    if (childError) {
      // Rollback parent if child insert fails
      await supabase.from('services').delete().eq('id', parentRow.id);
      return res.status(500).json({ success: false, message: childError.message });
    }

    // 3. Re-fetch with nested select for a complete response
    const { data: fullRow, error: fetchError } = await supabase
      .from('services')
      .select('*, secondary_services(*), event_services(*)')
      .eq('id', parentRow.id)
      .single();

    if (fetchError) {
      return res.status(500).json({ success: false, message: fetchError.message });
    }

    return res.status(201).json({ success: true, data: mapServiceRow(fullRow) });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
