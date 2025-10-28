import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use service role key on server - ensure this is kept secret
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseServerInstance: SupabaseClient | null = null;

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

// Lazy initialization of Supabase client
export function getSupabaseServer(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  if (!supabaseServerInstance) {
    supabaseServerInstance = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
      global: { headers: { 'x-client-info': 'vkart-server' } },
    });
  }

  return supabaseServerInstance;
}

// For backwards compatibility, export a getter that returns the client or null
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. API calls will fail.');
      return undefined;
    }
    return (getSupabaseServer() as any)[prop];
  }
});
