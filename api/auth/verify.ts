const { handleCors } = require('../utils/cors');
const { getAuthUser } = require('../utils/auth');

module.exports = async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

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
};
