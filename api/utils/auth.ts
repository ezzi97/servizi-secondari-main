const { getSupabaseAdmin } = require('./supabase');

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

async function getAuthUser(req: any): Promise<AuthUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  const supabase = getSupabaseAdmin();

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name || '',
    role: profile?.role || 'user',
  };
}

module.exports = { getAuthUser };
