const { handleCors } = require('../utils/cors');
const { getAuthUser } = require('../utils/auth');
const { getSupabaseAdmin } = require('../utils/supabase');
const { mapServiceRow, mapChildToDb, childTable } = require('../utils/service-mapper');

function extractPrice(type: string, data: Record<string, any>): number | undefined {
  if (type === 'sport' && data.priceSport !== undefined) return data.priceSport;
  if (type === 'secondary' && data.price !== undefined) return data.price;
  return undefined;
}

function extractKilometers(type: string, data: Record<string, any>): number | undefined {
  if (type === 'sport' && data.kilometersSport !== undefined) return data.kilometersSport;
  if (type === 'secondary' && data.kilometers !== undefined) return data.kilometers;
  return undefined;
}

function extractServiceDate(type: string, data: Record<string, any>): string | undefined {
  if (type === 'sport' && data.eventDateSport !== undefined) return data.eventDateSport;
  if (type === 'secondary' && data.serviceDate !== undefined) return data.serviceDate;
  return undefined;
}

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Non autorizzato' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'ID servizio mancante' });
  }

  const supabase = getSupabaseAdmin();
  const nestedSelect = '*, secondary_services(*), event_services(*)';

  // ---- GET: single service ----
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('services').select(nestedSelect).eq('id', id).single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Servizio non trovato' });
    }

    if (user.role !== 'admin' && user.role !== 'operator' && data.user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'Non autorizzato' });
    }

    return res.status(200).json({ success: true, data: mapServiceRow(data) });
  }

  // ---- PUT: update service ----
  if (req.method === 'PUT') {
    const { data: existing, error: fetchError } = await supabase
      .from('services').select(nestedSelect).eq('id', id).single();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: 'Servizio non trovato' });
    }

    if (user.role !== 'admin' && existing.user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'Non autorizzato' });
    }

    const body = req.body || {};
    const {
      type: _type, userId: _userId, id: _id,
      createdAt: _ca, updatedAt: _ua,
      status: newStatus, ...formData
    } = body;

    // 1. Update parent fields if needed
    const parentUpdate: Record<string, any> = {};
    if (newStatus) parentUpdate.status = newStatus;

    const km = extractKilometers(existing.type, formData);
    const price = extractPrice(existing.type, formData);
    const serviceDate = extractServiceDate(existing.type, formData);
    if (km !== undefined) parentUpdate.kilometers = km;
    if (price !== undefined) parentUpdate.price = price;
    if (serviceDate !== undefined) parentUpdate.service_date = serviceDate;

    if (Object.keys(parentUpdate).length > 0) {
      const { error: parentError } = await supabase
        .from('services').update(parentUpdate).eq('id', id);

      if (parentError) {
        return res.status(500).json({ success: false, message: parentError.message });
      }
    }

    // 2. Update child fields if any form data was provided
    const childData = mapChildToDb(existing.type, formData);
    if (Object.keys(childData).length > 0) {
      const table = childTable(existing.type);

      const { error: childError } = await supabase
        .from(table).update(childData).eq('service_id', id);

      if (childError) {
        return res.status(500).json({ success: false, message: childError.message });
      }
    }

    if (Object.keys(parentUpdate).length === 0 && Object.keys(childData).length === 0) {
      return res.status(400).json({ success: false, message: 'Nessun dato da aggiornare' });
    }

    // 3. Return the updated service
    const { data: updated, error: refetchError } = await supabase
      .from('services').select(nestedSelect).eq('id', id).single();

    if (refetchError) {
      return res.status(500).json({ success: false, message: refetchError.message });
    }

    return res.status(200).json({ success: true, data: mapServiceRow(updated) });
  }

  // ---- DELETE: remove service (CASCADE removes child row) ----
  if (req.method === 'DELETE') {
    const { data: existing, error: fetchError } = await supabase
      .from('services').select('user_id').eq('id', id).single();

    if (fetchError || !existing) {
      return res.status(404).json({ success: false, message: 'Servizio non trovato' });
    }

    if (user.role !== 'admin' && existing.user_id !== user.id) {
      return res.status(403).json({ success: false, message: 'Non autorizzato' });
    }

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, message: 'Servizio eliminato con successo' });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
