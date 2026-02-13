const { handleCors } = require('../_utils/cors');
const { getSupabaseAdmin } = require('../_utils/supabase');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

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

  const supabase = getSupabaseAdmin();

  // Build the redirect URL for the password reset page
  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'http://localhost:3000';
  const redirectTo = `${origin}/reset-password`;

  // Always return success to avoid email enumeration
  try {
    await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  } catch {
    // Silently ignore errors to prevent email enumeration
  }

  return res.status(200).json({
    success: true,
    message: 'Se l\'indirizzo email è associato a un account, riceverai un link per reimpostare la password.',
  });
};
