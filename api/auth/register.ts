const { handleCors } = require('../_utils/cors');
const { getSupabaseAdmin } = require('../_utils/supabase');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password e nome sono obbligatori',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La password deve essere di almeno 6 caratteri',
    });
  }

  const supabase = getSupabaseAdmin();

  // Build redirect URL for email confirmation
  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: 'user' },
      emailRedirectTo: `${origin}/auth/callback?type=email_confirm`,
    },
  });
  
  if (error) {
    if (error.message.includes('already registered')) {
      return res.status(409).json({
        success: false,
        message: 'Questa email è già registrata',
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (!data.user || !data.session) {
    if (data.user?.user_metadata?.email_verified == false) {
      return res.status(400).json({
        success: false,
        message: "Controlla la tua email per confermare l'account.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Registrazione fallita.",
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        role: 'user',
      },
    },
  });
};
