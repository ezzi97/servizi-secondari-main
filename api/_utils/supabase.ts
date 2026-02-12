const { createClient } = require('@supabase/supabase-js');

let _adminClient: any = null;

function getSupabaseAdmin() {
  if (_adminClient) return _adminClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  _adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _adminClient;
}

module.exports = { getSupabaseAdmin };
