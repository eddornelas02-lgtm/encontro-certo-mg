import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Validação robusta de URL HTTP/HTTPS
function getValidSupabaseUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    try {
      const parsed = new URL(envUrl.trim());
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString().replace(/\/$/, '');
      }
    } catch {
      // Valor inválido em .env.local, usar fallback
    }
  }
  return 'https://encontrocerto-mg.supabase.co';
}

function getValidSupabaseKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_mg_anon_key';
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = getValidSupabaseKey();

let clientInstance: SupabaseClient;

try {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
} catch (err) {
  console.warn('Erro ao inicializar Supabase, instanciando fallback resiliente:', err);
  clientInstance = createClient('https://encontrocerto-mg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabase = clientInstance;

export const YOUTUBE_API_KEY = 'AIzaSyDKUmaBzP3IZTKxxdVvrMta9-0X-JiEJW0';
