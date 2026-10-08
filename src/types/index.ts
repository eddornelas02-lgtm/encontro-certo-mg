// Encontro Certo Minas Gerais - Definições e Dados Regionais

export type Mode = 'amor' | 'amizade';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  city: string;
  city_code: number;
  region: string;
  mode: Mode;
  bio: string;
  photos: string[]; // Exatamente até 6 fotos
  interests: string[];
  occupation?: string;
  distanceKm?: number;
  updated_at: string;
}

export interface ActiveSession {
  id: string;
  user_id: string;
  city: string;
  last_ping: string;
  current_mode: Mode;
  is_online: boolean;
}

export interface IntentionCard {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  city: string;
  region: string;
  mode: Mode;
  title: string;
  description: string;
  spot_name: string; // ex: Mercado Central, Mirante da Serra, etc.
  created_at: string; // ISO string, expira em 24h
  interested_count: number;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  type: 'text' | 'audio' | 'cupido' | 'system' | 'game';
  content: string;
  audio_url?: string;
  audio_duration?: number;
  cupido_profile?: UserProfile;
  game_data?: any;
  created_at: string;
}

export interface MatchItem {
  id: string;
  user: UserProfile;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  mode: Mode;
  created_at: string;
}

export interface YouTubeSyncState {
  video_id: string;
  title: string;
  artist: string;
  thumbnail: string;
  is_playing: boolean;
  current_time: number;
  updated_at: string;
}

export type ChatClima = 'padrao' | 'por_do_sol' | 'ouro_preto' | 'chuva_fazenda';

/**
 * Cidades de Minas Gerais com região e código IBGE.
 * O código IBGE é exigido pelo banco (user_profiles.city_code entre 3100000 e 3199999).
 */
export interface MgCity {
  name: string;
  region: string;
  code: number;
}

export const MG_CITIES_DATA: MgCity[] = [
  // Central / Belo Horizonte
  { name: 'Belo Horizonte', region: 'Central / Belo Horizonte', code: 3106200 },
  { name: 'Contagem', region: 'Central / Belo Horizonte', code: 3118601 },
  { name: 'Betim', region: 'Central / Belo Horizonte', code: 3106705 },
  { name: 'Nova Lima', region: 'Central / Belo Horizonte', code: 3144805 },
  { name: 'Sabará', region: 'Central / Belo Horizonte', code: 3156700 },
  { name: 'Santa Luzia', region: 'Central / Belo Horizonte', code: 3157807 },
  { name: 'Ibirité', region: 'Central / Belo Horizonte', code: 3129806 },
  { name: 'Ribeirão das Neves', region: 'Central / Belo Horizonte', code: 3154606 },
  { name: 'Ouro Preto', region: 'Central / Belo Horizonte', code: 3145000 },
  { name: 'Mariana', region: 'Central / Belo Horizonte', code: 3140001 },
  { name: 'Itabira', region: 'Central / Belo Horizonte', code: 3131703 },
  { name: 'Conselheiro Lafaiete', region: 'Central / Belo Horizonte', code: 3118304 },
  // Triângulo Mineiro
  { name: 'Uberlândia', region: 'Triângulo Mineiro', code: 3170206 },
  { name: 'Uberaba', region: 'Triângulo Mineiro', code: 3170107 },
  { name: 'Araguari', region: 'Triângulo Mineiro', code: 3103504 },
  { name: 'Ituiutaba', region: 'Triângulo Mineiro', code: 3134202 },
  // Sul de Minas
  { name: 'Poços de Caldas', region: 'Sul de Minas', code: 3151800 },
  { name: 'Pouso Alegre', region: 'Sul de Minas', code: 3152501 },
  { name: 'Varginha', region: 'Sul de Minas', code: 3170701 },
  { name: 'Itajubá', region: 'Sul de Minas', code: 3132404 },
  { name: 'Lavras', region: 'Sul de Minas', code: 3138203 },
  { name: 'Alfenas', region: 'Sul de Minas', code: 3101607 },
  { name: 'Monte Verde (Camanducaia)', region: 'Sul de Minas', code: 3110509 },
  { name: 'São Lourenço', region: 'Sul de Minas', code: 3163706 },
  { name: 'Caxambu', region: 'Sul de Minas', code: 3115508 },
  { name: 'Três Corações', region: 'Sul de Minas', code: 3169406 },
  // Zona da Mata
  { name: 'Juiz de Fora', region: 'Zona da Mata', code: 3136702 },
  { name: 'Ubá', region: 'Zona da Mata', code: 3170008 },
  { name: 'Muriaé', region: 'Zona da Mata', code: 3143906 },
  { name: 'Viçosa', region: 'Zona da Mata', code: 3171303 },
  // Norte de Minas
  { name: 'Montes Claros', region: 'Norte de Minas', code: 3143302 },
  // Campo das Vertentes
  { name: 'São João del-Rei', region: 'Campo das Vertentes', code: 3162500 },
  { name: 'Tiradentes', region: 'Campo das Vertentes', code: 3168804 },
  { name: 'Barbacena', region: 'Campo das Vertentes', code: 3105608 },
  // Vale do Aço
  { name: 'Ipatinga', region: 'Vale do Aço', code: 3131307 },
  { name: 'Coronel Fabriciano', region: 'Vale do Aço', code: 3119401 },
  // Vale do Rio Doce
  { name: 'Governador Valadares', region: 'Vale do Rio Doce', code: 3127701 },
  { name: 'Caratinga', region: 'Vale do Rio Doce', code: 3113404 },
  { name: 'Teófilo Otoni', region: 'Vale do Rio Doce', code: 3168606 },
  // Oeste de Minas
  { name: 'Divinópolis', region: 'Oeste de Minas', code: 3122306 },
  { name: 'Nova Serrana', region: 'Oeste de Minas', code: 3145208 },
  { name: 'Pará de Minas', region: 'Oeste de Minas', code: 3147105 },
  { name: 'Sete Lagoas', region: 'Oeste de Minas', code: 3167202 },
  // Alto Paranaíba
  { name: 'Patos de Minas', region: 'Alto Paranaíba', code: 3148004 },
  { name: 'Paracatu', region: 'Alto Paranaíba', code: 3147006 },
  // Lago de Furnas
  { name: 'Capitólio', region: 'Sul / Lago de Furnas', code: 3112901 },
  // Jequitinhonha / Mucuri
  { name: 'Diamantina', region: 'Vale do Jequitinhonha / Mucuri', code: 3121605 },
];

export const MG_CITIES: string[] = MG_CITIES_DATA.map((c) => c.name);

export const MG_CITY_REGION_MAP: Record<string, string> = MG_CITIES_DATA.reduce(
  (acc, c) => {
    acc[c.name] = c.region;
    return acc;
  },
  {} as Record<string, string>
);

export const MG_CITY_CODES: Record<string, number> = MG_CITIES_DATA.reduce(
  (acc, c) => {
    acc[c.name] = c.code;
    return acc;
  },
  {} as Record<string, number>
);

const DEFAULT_CITY_CODE = 3106200; // Belo Horizonte

export function getCityCode(city: string): number {
  return MG_CITY_CODES[city] ?? DEFAULT_CITY_CODE;
}

export function getCityRegion(city: string): string {
  return MG_CITY_REGION_MAP[city] ?? 'Minas Gerais';
}

export const MODES = {
  AMOR: 'amor',
  AMIZADE: 'amizade',
} as const;