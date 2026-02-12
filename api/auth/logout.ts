const { handleCors } = require('../_utils/cors');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    message: 'Logout effettuato con successo',
  });
};
