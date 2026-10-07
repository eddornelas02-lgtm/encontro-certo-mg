import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Tipos TypeScript
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          city: string
          region: string
          mode: 'amor' | 'amizade'
          bio: string
          photos: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city: string
          region: string
          mode: 'amor' | 'amizade'
          bio: string
          photos?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city?: string
          region?: string
          mode?: 'amor' | 'amizade'
          bio?: string
          photos?: string[]
          updated_at?: string
        }
      }
      active_sessions: {
        Row: {
          id: string
          user_id: string
          city: string
          last_ping: string
          current_mode: 'amor' | 'amizade'
        }
        Insert: {
          id?: string
          user_id: string
          city: string
          last_ping?: string
          current_mode: 'amor' | 'amizade'
        }
        Update: {
          id?: string
          user_id?: string
          city?: string
          last_ping?: string
          current_mode?: 'amor' | 'amizade'
        }
      }
      intentions: {
        Row: {
          id: string
          user_id: string
          city: string
          region: string
          mode: 'amor' | 'amizade'
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city: string
          region: string
          mode: 'amor' | 'amizade'
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city?: string
          region?: string
          mode?: 'amor' | 'amizade'
          text?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user1: string
          user2: string
          mode: 'amor' | 'amizade'
          created_at: string
        }
        Insert: {
          id?: string
          user1: string
          user2: string
          mode: 'amor' | 'amizade'
          created_at?: string
        }
        Update: {
          id?: string
          user1?: string
          user2?: string
          mode?: 'amor' | 'amizade'
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          match_id: string
          user1: string
          user2: string
          mode: 'amor' | 'amizade'
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          user1: string
          user2: string
          mode: 'amor' | 'amizade'
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          user1?: string
          user2?: string
          mode?: 'amor' | 'amizade'
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          type: 'text' | 'audio' | 'youtube'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          type: 'text' | 'audio' | 'youtube'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          type?: 'text' | 'audio' | 'youtube'
          content?: string
          created_at?: string
        }
      }
      youtube_sync: {
        Row: {
          id: string
          chat_id: string
          video_id: string
          play_state: 'playing' | 'paused' | 'ended'
          timestamp: number
          updated_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          video_id: string
          play_state?: 'playing' | 'paused' | 'ended'
          timestamp?: number
          updated_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          video_id?: string
          play_state?: 'playing' | 'paused' | 'ended'
          timestamp?: number
          updated_at?: string
        }
      }
    }
  }
}

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type ActiveSession = Database['public']['Tables']['active_sessions']['Row']
export type Intention = Database['public']['Tables']['intentions']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Chat = Database['public']['Tables']['chats']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type YouTubeSync = Database['public']['Tables']['youtube_sync']['Row']

// Cities in Minas Gerais
export const MG_CITIES = [
  'Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Montes Claros', 
  'Ouro Preto', 'Poços de Caldas', 'Ipatinga', 'Uberaba', 
  'Divinópolis', 'Governador Valadares', 'Varginha', 'Pouso Alegre',
  'Betim', 'Contagem', 'Sabará', 'Santa Luzia', 'Itabira', 'Ituiutaba',
  'Patos de Minas', 'Almenara', 'Teófilo Otoni', 'Itaúna', 'São João del Rei',
  'Diamantina', 'São Gonçalo do Sapucaí', 'Carmo do Cajuru', 'Capelinha'
]

export const MG_REGIONS = [
  'Metropolitana de Belo Horizonte',
  'Triângulo Mineiro', 
  'Sul de Minas',
  'Zona da Mata',
  'Norte de Minas',
  'Campo das Vertentes',
  'Vale do Jequitinhonha',
  'Vale do Aço'
]

export const MODES = {
  AMOR: 'amor',
  AMIZADE: 'amizade'
} as const

export type Mode = typeof MODES[keyof typeof MODES]

// Helper functions
export const getModeColor = (mode: Mode) => {
  return mode === 'amor' ? '#FF007F' : '#FFB700'
}

export const getModeGradient = (mode: Mode) => {
  return mode === 'amor' 
    ? 'from-[#FF007F] to-[#FF2A85]' 
    : 'from-[#FFB700] to-[#FF8800]'
}

export const getModeGlow = (mode: Mode) => {
  return mode === 'amor' 
    ? 'shadow-[0_0_20px_rgba(255,0,127,0.5)]' 
    : 'shadow-[0_0_20px_rgba(255,183,0,0.5)]'
}