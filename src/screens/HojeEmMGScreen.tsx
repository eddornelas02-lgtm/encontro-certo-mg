import React, { useState } from 'react';
import {
  CalendarHeart,
  Plus,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Coffee,
  ArrowLeft,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { IntentionCard, MG_CITIES, UserProfile, getCityCode } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface HojeEmMGScreenProps {
  onOpenChatWithAuthor: (author: UserProfile, initialMessage: string) => void;
}

const INITIAL_INTENTIONS: IntentionCard[] = [
  {
    id: 'int-1',
    user_id: 'usr-1',
    author_name: 'Carolina Rezende',
    author_avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Belo Horizonte',
    region: 'Central / Belo Horizonte',
    mode: 'amor',
    spot_name: 'Mercado Central de BH',
    title: 'Tomar um café coado com broa de milho',
    description:
      'Vou dar uma passada no Mercado Central no início da tarde para comprar queijo do Serro e tomar aquele cafezinho sem pressa. Quem topa uma prosa boa?',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    interested_count: 3,
  },
  {
    id: 'int-2',
    user_id: 'usr-2',
    author_name: 'Mateus Silveira',
    author_avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    city: 'Uberlândia',
    region: 'Triângulo Mineiro',
    mode: 'amor',
    spot_name: 'Parque do Sabiá',
    title: 'Caminhada no fim de tarde e pôr do sol',
    description:
      'Fim de tarde no Sabiá depois do trampo. Se alguém quiser acompanhar a volta na represa e bater papo sobre música e vida leve, me manda mensagem!',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    interested_count: 5,
  },
  {
    id: 'int-3',
    user_id: 'usr-3',
    author_name: 'Isabela Fontes',
    author_avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    city: 'Ouro Preto',
    region: 'Central / Belo Horizonte',
    mode: 'amizade',
    spot_name: 'Praça Tiradentes',
    title: 'Fotografar o entardecer nas ladeiras históricas',
    description:
      'Tarde livre para caminhar com a câmera fotográfica pelas ruas de paralelepípedo e parar num bistrô quentinho para tomar chocolate quente.',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    interested_count: 2,
  },
  {
    id: 'int-4',
    user_id: 'usr-4',
    author_name: 'Lucas Drummond',
    author_avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    city: 'Poços de Caldas',
    region: 'Sul de Minas',
    mode: 'amizade',
    spot_name: 'Mirante da Serra de São Domingos',
    title: 'Subir o Cristo para ver as montanhas',
    description:
      'Buscando parceria esportiva ou amizade para subir o teleférico/trilha e contemplar a vista do Sul de Minas com café na garrafa térmica.',
    created_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    interested_count: 4,
  },
];

export const HojeEmMGScreen: React.FC<HojeEmMGScreenProps> = ({
  onOpenChatWithAuthor,
}) => {
  const { mode, currentCity, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  const [intentions, setIntentions] = useState<IntentionCard[]>(INITIAL_INTENTIONS);
  const [selectedFilterCity, setSelectedFilterCity] = useState<string>('Todas as Cidades');
  const [modalNovaIntencao, setModalNovaIntencao] = useState(false);

  // Formulário nova intenção
  const [formSpot, setFormSpot] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCity, setFormCity] = useState(currentCity);

  // Filtro de expiração matemática rigorosa: máximo 24 horas (created_at + 24h > now)
  const nowMs = Date.now();
  const activeIntentions = intentions.filter((item) => {
    // 1. Filtro estrito de modo ativo (Amor vs Amizade)
    if (item.mode !== mode) return false;

    // 2. Filtro de tempo: 24 horas
    const createdMs = new Date(item.created_at).getTime();
    const diffHours = (nowMs - createdMs) / (1000 * 60 * 60);
    if (diffHours >= 24) return false;

    // 3. Filtro de localização
    if (selectedFilterCity !== 'Todas as Cidades' && item.city !== selectedFilterCity) {
      return false;
    }

    return true;
  });

  const getHoursRemaining = (createdAt: string) => {
    const createdMs = new Date(createdAt).getTime();
    const passedMs = Date.now() - createdMs;
    const remainingMs = 24 * 60 * 60 * 1000 - passedMs;
    const remainingHours = Math.max(1, Math.floor(remainingMs / (1000 * 60 * 60)));
    return `${remainingHours}h restantes`;
  };

  const handleTenhoInteresse = (item: IntentionCard) => {
    triggerHaptic('success');
    // Cria perfil simulado do autor para abrir a conversa
    const authorProfile: UserProfile = {
      id: item.user_id,
      user_id: item.user_id,
      name: item.author_name,
      age: 26,
      city: item.city,
      city_code: getCityCode(item.city),
      region: item.region,
      mode: item.mode,
      bio: item.description,
      photos: [item.author_avatar],
      interests: [item.spot_name, 'Hoje em MG'],
      updated_at: new Date().toISOString(),
    };

    const conviteTexto = `Olá ${item.author_name}! Vi sua publicação no "Hoje em MG" sobre "${item.title}" em ${item.spot_name} e tenho muito interesse em acompanhar você!`;

    onOpenChatWithAuthor(authorProfile, conviteTexto);
  };

  const handleCriarIntencao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSpot.trim() || !formTitle.trim() || !formDesc.trim()) return;

    triggerHaptic('success');
    const nova: IntentionCard = {
      id: `int-${Date.now()}`,
      user_id: 'me',
      author_name: 'Você',
      author_avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: formCity,
      region: 'Minas Gerais',
      mode,
      spot_name: formSpot,
      title: formTitle,
      description: formDesc,
      created_at: new Date().toISOString(),
      interested_count: 0,
    };

    setIntentions([nova, ...intentions]);
    setFormSpot('');
    setFormTitle('');
    setFormDesc('');
    setModalNovaIntencao(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar select-none px-4 pb-28 pt-1">
      {/* Topo do Feed com Botão de Criação */}
      <div className="flex items-center justify-between py-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarHeart
              className={`w-6 h-6 ${isLove ? 'text-[#FF007F]' : 'text-[#FFB700]'}`}
            />
            Hoje em MG
          </h2>
          <p className="text-[11px] text-white/60">
            Convites e rolês para as próximas 24h em Minas
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            setModalNovaIntencao(true);
          }}
          className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-lg active:scale-95 transition-all ${
            isLove
              ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] shadow-[0_0_12px_rgba(255,0,127,0.5)]'
              : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_12px_rgba(255,183,0,0.5)]'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Publicar</span>
        </button>
      </div>

      {/* Filtro por Cidades Mineiras */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedFilterCity('Todas as Cidades')}
          className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
            selectedFilterCity === 'Todas as Cidades'
              ? isLove
                ? 'bg-[#FF007F] text-white'
                : 'bg-[#FFB700] text-black font-bold'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          Todas de MG
        </button>

        {MG_CITIES.slice(0, 15).map((city) => (
          <button
            key={city}
            onClick={() => {
              triggerHaptic('light');
              setSelectedFilterCity(city);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              selectedFilterCity === city
                ? isLove
                  ? 'bg-[#FF007F] text-white'
                  : 'bg-[#FFB700] text-black font-bold'
                : 'bg-white/5 text-white/70 hover:text-white'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Lista de Cards de Intenção com visual luminoso acolhedor */}
      <div className="flex flex-col gap-3.5 mt-1">
        {activeIntentions.length > 0 ? (
          activeIntentions.map((card) => (
            <div
              key={card.id}
              className={`p-4 rounded-3xl backdrop-blur-xl border transition-all ${
                isLove
                  ? 'bg-gradient-to-br from-[#1C0A17]/90 via-[#120710]/95 to-[#0A0A0F] border-[#FF007F]/30 hover:border-[#FF007F]/50 shadow-[0_4px_20px_rgba(255,0,127,0.15)]'
                  : 'bg-gradient-to-br from-[#1E1708]/90 via-[#140F04]/95 to-[#0A0A0F] border-[#FFB700]/30 hover:border-[#FFB700]/50 shadow-[0_4px_20px_rgba(255,183,0,0.15)]'
              }`}
            >
              {/* Autor e Tempo Restante (expiração em 24h) */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={card.author_avatar}
                    alt={card.author_name}
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{card.author_name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-white/60">
                      <MapPin className="w-3 h-3 text-[#FF55A3]" />
                      <span>{card.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{getHoursRemaining(card.created_at)}</span>
                </div>
              </div>

              {/* Ponto de encontro típico em MG */}
              <div className="pt-2.5">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    isLove
                      ? 'bg-[#FF007F]/20 text-[#FF55A3]'
                      : 'bg-[#FFB700]/20 text-[#FFC933]'
                  }`}
                >
                  📍 {card.spot_name}
                </span>

                <h3 className="text-sm font-bold text-white leading-snug">{card.title}</h3>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Botão Tenho Interesse que abre a janela de chat instantaneamente */}
              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] text-white/50">
                  {card.interested_count} pessoas interessadas
                </span>

                <button
                  onClick={() => handleTenhoInteresse(card)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                    isLove
                      ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_14px_rgba(255,0,127,0.5)]'
                      : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_14px_rgba(255,183,0,0.5)]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Tenho Interesse</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-3">
            <Compass className="w-10 h-10 text-white/30" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Nenhum convite ativo no momento</p>
              <p className="text-xs text-white/50 max-w-xs">
                Seja o primeiro a convidar para um café ou passeio em {selectedFilterCity}!
              </p>
            </div>
            <button
              onClick={() => setModalNovaIntencao(true)}
              className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
            >
              Publicar Convite
            </button>
          </div>
        )}
      </div>

      {/* Modal para Publicar Nova Intenção */}
      {modalNovaIntencao && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#141420] border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarHeart className="w-4 h-4 text-[#FF007F]" />
                Publicar Convite em MG (Expira em 24h)
              </h3>
              <button
                type="button"
                onClick={() => setModalNovaIntencao(false)}
                aria-label="Voltar para Hoje em MG"
                className="flex shrink-0 items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            </div>

            <form onSubmit={handleCriarIntencao} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-medium text-white/70 block mb-1">
                  Cidade de Minas Gerais
                </label>
                <select
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {MG_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#12121a]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-white/70 block mb-1">
                  Local / Ponto de Encontro
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mercado Central, Mirante das Mangabeiras, Praça da Liberdade..."
                  value={formSpot}
                  onChange={(e) => setFormSpot(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-white/70 block mb-1">
                  Título Curto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tomar um café e comer pão de queijo quentinho"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-white/70 block mb-1">
                  Descrição do Rolê
                </label>
                <textarea
                  placeholder="Conte como imagina esse momento ou que tipo de prosa gostaria de ter..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-[#1c1c2b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 outline-none h-20 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-2xl text-xs font-bold text-white transition-all ${
                  isLove
                    ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                    : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_15px_rgba(255,183,0,0.5)]'
                }`}
              >
                Publicar no Hoje em MG
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
