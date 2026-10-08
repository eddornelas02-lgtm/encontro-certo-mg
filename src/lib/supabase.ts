import { createClient } from '@supabase/supabase-js';

// Chave e URL configuradas pelo usuário ou com fallback seguro
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mg-encontrocerto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-mg-encontrocerto';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

export const YOUTUBE_API_KEY = 'AIzaSyDKUmaBzP3IZTKxxdVvrMta9-0X-JiEJW0';
