import { createClient } from '@supabase/supabase-js';

// Use service role key on server - ensure this is kept secret
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Do not throw in module initialization; let routes handle missing config gracefully
  console.warn('Supabase keys are not configured. Supabase-related API routes will return errors until configured.');
}

export const supabaseServer = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false },
  global: { headers: { 'x-client-info': 'vkart-server' } },
});
