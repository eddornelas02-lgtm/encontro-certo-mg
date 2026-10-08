import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Projeto Supabase já integrado do "Encontro Certo MG"
const SUPABASE_URL = 'https://pcdijsipifuldyvkojpq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Y0IHEQ5K1QzToQtvFUofOA_Y89I7Ed4';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const YOUTUBE_API_KEY = 'AIzaSyDKUmaBzP3IZTKxxdVvrMta9-0X-JiEJW0';