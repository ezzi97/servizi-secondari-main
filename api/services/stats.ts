const { handleCors } = require('../_utils/cors');
const { getAuthUser } = require('../_utils/auth');
const { getSupabaseAdmin } = require('../_utils/supabase');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Non autorizzato' });
  }

  const { type, dateFrom, dateTo } = req.query;
  const supabase = getSupabaseAdmin();

  // Only need parent table columns for stats (status, price, kilometers)
  let query = supabase.from('services').select('status, price, kilometers');

  if (user.role !== 'admin' && user.role !== 'operator') {
    query = query.eq('user_id', user.id);
  }

  if (type) query = query.eq('type', type);
  if (dateFrom) query = query.gte('service_date', dateFrom);
  if (dateTo) query = query.lte('service_date', dateTo);

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  const services = data || [];
  const total = services.length;
  const completed = services.filter((s: any) => s.status === 'completed').length;
  const pending = services.filter((s: any) => s.status === 'pending').length;
  const cancelled = services.filter((s: any) => s.status === 'cancelled').length;
  const totalRevenue = services
    .filter((s: any) => s.status === 'completed')
    .reduce((sum: number, s: any) => sum + (parseFloat(s.price) || 0), 0);
  const averagePrice = total > 0 ? totalRevenue / Math.max(completed, 1) : 0;
  const totalKilometers = services
    .reduce((sum: number, s: any) => sum + (parseFloat(s.kilometers) || 0), 0);

  return res.status(200).json({
    success: true,
    data: {
      total, completed, pending, cancelled,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averagePrice: Math.round(averagePrice * 100) / 100,
      totalKilometers: Math.round(totalKilometers * 100) / 100,
    },
  });
};
