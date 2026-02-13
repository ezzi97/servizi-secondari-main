const { handleCors } = require('../_utils/cors');
const { getAuthUser } = require('../_utils/auth');
const { getSupabaseAdmin } = require('../_utils/supabase');

async function getFullProfile(userId) {
  const supabase = getSupabaseAdmin();
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, phone, address, avatar_url, created_at, updated_at')
    .eq('id', userId)
    .single();

  return profile;
}

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const authUser = await getAuthUser(req);
  if (!authUser) {
    return res.status(401).json({ success: false, message: 'Non autorizzato' });
  }

  const supabase = getSupabaseAdmin();

  if (req.method === 'GET') {
    const profile = await getFullProfile(authUser.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profilo non trovato' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: authUser.id,
        email: authUser.email,
        name: profile.name || '',
        role: profile.role || 'user',
        phone: profile.phone || '',
        address: profile.address || '',
        avatarUrl: profile.avatar_url || '',
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    });
  }

  if (req.method === 'PUT') {
    const { name, phone, address, avatarUrl } = req.body || {};

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone || null;
    if (address !== undefined) updates.address = address || null;
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl || null;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nessun campo da aggiornare',
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authUser.id)
      .select('name, role, phone, address, avatar_url, updated_at')
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Errore durante l\'aggiornamento del profilo',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: authUser.id,
        email: authUser.email,
        name: data.name || '',
        role: data.role || 'user',
        phone: data.phone || '',
        address: data.address || '',
        avatarUrl: data.avatar_url || '',
        updatedAt: data.updated_at,
      },
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
