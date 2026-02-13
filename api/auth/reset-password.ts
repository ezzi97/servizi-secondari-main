const { handleCors } = require('../_utils/cors');
const { getSupabaseAdmin } = require('../_utils/supabase');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

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

  const supabase = getSupabaseAdmin();

  // Verify the token to get the user
  const { data: { user }, error: verifyError } = await supabase.auth.getUser(token);

  if (verifyError || !user) {
    return res.status(401).json({
      success: false,
      message: 'Link non valido o scaduto. Richiedi un nuovo link di recupero.',
    });
  }

  // Update the user's password using the admin client
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
  });

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
};
