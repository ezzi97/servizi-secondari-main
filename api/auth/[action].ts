const { handleCors } = require('../_utils/cors');
const { getSupabaseAdmin } = require('../_utils/supabase');
const { getAuthUser } = require('../_utils/auth');

function getAction(req: any): string | null {
  const action = req.query?.action;
  return typeof action === 'string' ? action.trim().toLowerCase() : null;
}

async function handleLogin(req: any, res: any, supabase: any) {
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
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === 'email_not_confirmed') {
      return res.status(401).json({
        success: false,
        message: "Email non confermata. Controlla la tua email per confermare l'account.",
      });
    }
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
  const meta = data.user.user_metadata || {};
  const name =
    (profile?.name && profile.name.trim()) ||
    meta.name ||
    meta.full_name ||
    meta.given_name ||
    '';
  return res.status(200).json({
    success: true,
    data: {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name.trim() || '',
        role: profile?.role || 'user',
        phone: profile?.phone || '',
        address: profile?.address || '',
        avatarUrl: profile?.avatar_url || '',
      },
    },
  });
}

async function handleRegister(req: any, res: any, supabase: any) {
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
      message: 'Registrazione fallita.',
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
}

async function handleLogout(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  return res.status(200).json({
    success: true,
    message: 'Logout effettuato con successo',
  });
}

async function handleVerify(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Token non valido o scaduto',
    });
  }
  return res.status(200).json({
    success: true,
    data: { user },
  });
}

async function handleForgotPassword(req: any, res: any, supabase: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email è obbligatorio',
    });
  }
  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:3000';
  const redirectTo = `${origin}/reset-password`;
  try {
    await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  } catch {
    // Silently ignore to avoid email enumeration
  }
  return res.status(200).json({
    success: true,
    message: "Se l'indirizzo email è associato a un account, riceverai un link per reimpostare la password.",
  });
}

async function handleResetPassword(req: any, res: any, supabase: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: 'Token e nuova password sono obbligatori',
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La password deve essere di almeno 6 caratteri',
    });
  }
  const { data: { user }, error: verifyError } = await supabase.auth.getUser(token);
  if (verifyError || !user) {
    return res.status(401).json({
      success: false,
      message: 'Link non valido o scaduto. Richiedi un nuovo link di recupero.',
    });
  }
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (updateError) {
    return res.status(500).json({
      success: false,
      message: 'Errore durante il reset della password. Riprova più tardi.',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Password reimpostata con successo.',
  });
}

async function handleGoogle(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    return res.status(500).json({ success: false, message: 'SUPABASE_URL not configured' });
  }
  let origin = req.headers.origin;
  if (!origin && req.headers.referer) {
    try {
      origin = new URL(req.headers.referer).origin;
    } catch {
      // ignore
    }
  }
  if (!origin) {
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'localhost:3000';
    origin = `${proto}://${host}`;
  }
  const redirectTo = `${origin}/auth/callback`;
  const url = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  return res.status(200).json({
    success: true,
    data: { url },
  });
}

const handlers: Record<string, (req: any, res: any, supabase?: any) => Promise<any>> = {
  login: handleLogin,
  register: handleRegister,
  logout: handleLogout,
  verify: handleVerify,
  'forgot-password': handleForgotPassword,
  'reset-password': handleResetPassword,
  google: handleGoogle,
};

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const action = getAction(req);
  if (!action || !handlers[action]) {
    return res.status(404).json({ success: false, message: 'Auth action not found' });
  }

  const supabase = getSupabaseAdmin();
  const fn = handlers[action];
  return fn(req, res, supabase);
};
