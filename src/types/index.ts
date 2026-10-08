// Encontro Certo Minas Gerais - Definições e Dados Regionais

export type Mode = 'amor' | 'amizade';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  city: string;
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

export const MG_REGIONS = [
  'Central / Belo Horizonte',
  'Triângulo Mineiro',
  'Sul de Minas',
  'Zona da Mata',
  'Norte de Minas',
  'Campo das Vertentes',
  'Vale do Aço',
  'Noroeste de Minas',
  'Vale do Jequitinhonha / Mucuri',
] as const;

export const MG_CITIES = [
  'Belo Horizonte',
  'Uberlândia',
  'Contagem',
  'Juiz de Fora',
  'Betim',
  'Montes Claros',
  'Ribeirão das Neves',
  'Uberaba',
  'Governador Valadares',
  'Ipatinga',
  'Sete Lagoas',
  'Divinópolis',
  'Santa Luzia',
  'Ibirité',
  'Poços de Caldas',
  'Patos de Minas',
  'Pouso Alegre',
  'Teófilo Otoni',
  'Barbacena',
  'Sabará',
  'Varginha',
  'Conselheiro Lafaiete',
  'Itabira',
  'Araguari',
  'Passos',
  'Ubá',
  'Coronel Fabriciano',
  'Muriaé',
  'Ituiutaba',
  'Lavras',
  'Nova Lima',
  'Itajubá',
  'Pará de Minas',
  'Paracatu',
  'Caratinga',
  'Nova Serrana',
  'São João del-Rei',
  'Ouro Preto',
  'Mariana',
  'Tiradentes',
  'Diamantina',
  'São Lourenço',
  'Caxambu',
  'Capitólio',
  'Monte Verde (Camanducaia)',
  'Viçosa',
  'Alfenas',
  'Três Corações',
] as const;

export const MG_CITY_REGION_MAP: Record<string, string> = {
  'Belo Horizonte': 'Central / Belo Horizonte',
  'Contagem': 'Central / Belo Horizonte',
  'Betim': 'Central / Belo Horizonte',
  'Nova Lima': 'Central / Belo Horizonte',
  'Sabará': 'Central / Belo Horizonte',
  'Santa Luzia': 'Central / Belo Horizonte',
  'Uberlândia': 'Triângulo Mineiro',
  'Uberaba': 'Triângulo Mineiro',
  'Araguari': 'Triângulo Mineiro',
  'Ituiutaba': 'Triângulo Mineiro',
  'Juiz de Fora': 'Zona da Mata',
  'Ubá': 'Zona da Mata',
  'Muriaé': 'Zona da Mata',
  'Viçosa': 'Zona da Mata',
  'Montes Claros': 'Norte de Minas',
  'Poços de Caldas': 'Sul de Minas',
  'Pouso Alegre': 'Sul de Minas',
  'Varginha': 'Sul de Minas',
  'Itajubá': 'Sul de Minas',
  'Lavras': 'Sul de Minas',
  'Alfenas': 'Sul de Minas',
  'Monte Verde (Camanducaia)': 'Sul de Minas',
  'São Lourenço': 'Sul de Minas',
  'Caxambu': 'Sul de Minas',
  'Ouro Preto': 'Central / Belo Horizonte',
  'Mariana': 'Central / Belo Horizonte',
  'Tiradentes': 'Campo das Vertentes',
  'São João del-Rei': 'Campo das Vertentes',
  'Barbacena': 'Campo das Vertentes',
  'Ipatinga': 'Vale do Aço',
  'Coronel Fabriciano': 'Vale do Aço',
  'Governador Valadares': 'Vale do Rio Doce',
  'Diamantina': 'Vale do Jequitinhonha / Mucuri',
  'Teófilo Otoni': 'Vale do Jequitinhonha / Mucuri',
  'Divinópolis': 'Oeste de Minas',
  'Nova Serrana': 'Oeste de Minas',
  'Pará de Minas': 'Oeste de Minas',
  'Patos de Minas': 'Alto Paranaíba',
  'Capitólio': 'Sul / Lago de Furnas',
};

// Exemplos iniciais realistas e calorosos de Minas Gerais para o primeiro load
export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'mg-usr-1',
    user_id: 'usr-1',
    name: 'Carolina Rezende',
    age: 26,
    city: 'Belo Horizonte',
    region: 'Central / Belo Horizonte',
    mode: 'amor',
    bio: 'Mineira raiz que não dispensa um café com pão de queijo quentinho no Mercado Central. Arquiteta, fã de MPB ao vivo na Savassi e trilhas na Serra do Curral aos sábados.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Café Mineiro', 'Savassi', 'Serra do Curral', 'MPB', 'Vinho no frio'],
    occupation: 'Arquiteta Urbanista',
    distanceKm: 4,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mg-usr-2',
    user_id: 'usr-2',
    name: 'Mateus Silveira',
    age: 29,
    city: 'Uberlândia',
    region: 'Triângulo Mineiro',
    mode: 'amor',
    bio: 'Engenheiro agrônomo, apaixonado pela calmaria do Triângulo e pela boa prosa. Gosto de violão no fim de tarde, cozinhar feijão tropeiro e viajar pelas cidades históricas de MG.',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Cozinha Mineira', 'Violão', 'Triângulo', 'Viagens', 'Cerveja Artesanal'],
    occupation: 'Engenheiro Agrônomo',
    distanceKm: 12,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mg-usr-3',
    user_id: 'usr-3',
    name: 'Isabela Fontes',
    age: 25,
    city: 'Ouro Preto',
    region: 'Central / Belo Horizonte',
    mode: 'amizade',
    bio: 'Estudante de História da Arte na UFOP. Adoro caminhar pelas ladeiras históricas com câmera analógica na mão, café coado na hora e rodas de conversa com gente leve e curiosa.',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Arte Barroca', 'Fotografia', 'UFOP', 'Trilhas', 'Livros'],
    occupation: 'Historiadora & Fotógrafa',
    distanceKm: 85,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mg-usr-4',
    user_id: 'usr-4',
    name: 'Lucas Drummond',
    age: 28,
    city: 'Poços de Caldas',
    region: 'Sul de Minas',
    mode: 'amizade',
    bio: 'Nascido no Sul de Minas, apaixonado por montanhismo, ciclismo de estrada e bater papo comendo queijo canastra. Procurando parcerias para pedais, cafés e novas amizades em MG!',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Ciclismo', 'Serra de São Domingos', 'Queijo Canastra', 'Trilhas', 'Café Especial'],
    occupation: 'Fisioterapeuta Esportivo',
    distanceKm: 140,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mg-usr-5',
    user_id: 'usr-5',
    name: 'Beatriz Alvarenga',
    age: 27,
    city: 'Juiz de Fora',
    region: 'Zona da Mata',
    mode: 'amor',
    bio: 'Médica veterinária, fã incondicional dos fins de semana na serra e de um bom papo com amigos ao som de violão. Valorizo sinceridade, carinho e quem sabe apreciar as coisas simples.',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    ],
    interests: ['Animais', 'Ibitipoca', 'Café', 'Violão', 'Natureza'],
    occupation: 'Médica Veterinária',
    distanceKm: 60,
    updated_at: new Date().toISOString(),
  },
];
