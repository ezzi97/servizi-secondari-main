const { handleCors } = require('../utils/cors');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    return res.status(500).json({ success: false, message: 'SUPABASE_URL not configured' });
  }

  // Extract just the origin (protocol + host), not the full referer path
  let origin = req.headers.origin;
  if (!origin && req.headers.referer) {
    try { origin = new URL(req.headers.referer).origin; } catch { /* ignore */ }
  }
  if (!origin) {
    const proto = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'localhost:3000';
    origin = `${proto}://${host}`;
  }
  const redirectTo = `${origin}/auth/callback`;

  // Construct the Supabase OAuth authorize URL directly
  const url = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

  return res.status(200).json({
    success: true,
    data: { url },
  });
};
