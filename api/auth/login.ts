const { handleCors } = require('../utils/cors');
const { getSupabaseAdmin } = require('../utils/supabase');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e password sono obbligatori',
    });
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({
      success: false,
      message: 'Credenziali non valide',
    });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role, phone, address, avatar_url')
    .eq('id', data.user.id)
    .single();

  return res.status(200).json({
    success: true,
    data: {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || '',
        role: profile?.role || 'user',
        phone: profile?.phone || '',
        address: profile?.address || '',
        avatarUrl: profile?.avatar_url || '',
      },
    },
  });
};
