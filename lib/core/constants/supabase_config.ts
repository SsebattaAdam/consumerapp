// Import with error handling in case @env fails to load
let SUPABASE_URL_ENV = '';
let SUPABASE_ANON_KEY_ENV = '';

try {
  const env = require('@env');
  SUPABASE_URL_ENV = env.SUPABASE_URL || '';
  SUPABASE_ANON_KEY_ENV = env.SUPABASE_ANON_KEY || '';
} catch (error) {
  console.warn('Failed to load environment variables, using defaults:', error);
  // Fallback values (you can set these as defaults)
  SUPABASE_URL_ENV = 'https://guquwpfadpujzzclrdkc.supabase.co';
  SUPABASE_ANON_KEY_ENV = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1cXV3cGZhZHB1anp6Y2xyZGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDc1NDMsImV4cCI6MjA3OTA4MzU0M30.RtvtBG08ixEETuncPq6ADHk_UgY9b9rNZMBD2cFIq4o';
}

export const SUPABASE_CONFIG = {
  /**
   * Supabase project URL. Example:
   * https://your-project.supabase.co
   */
  url: SUPABASE_URL_ENV,

  /**
   * Supabase anon/public key (safe for client-side use).
   * NEVER embed the service_role key in the client!
   */
  anonKey: SUPABASE_ANON_KEY_ENV,
};


