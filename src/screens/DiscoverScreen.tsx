import React, { useState } from 'react';
import {
  Heart,
  X,
  Share2,
  Sparkles,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
  Coffee,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { UserProfile, MG_CITIES } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { ProfileDetailModal } from '@/components/ProfileDetailModal';

interface DiscoverScreenProps {
  profiles: UserProfile[];
  onOpenChat: (profile: UserProfile, cupidoNote?: string) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  profiles,
  onOpenChat,
}) => {
  const { mode, toggleMode, currentCity, setCurrentCity, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  // Filtro regional
  const [locationScope, setLocationScope] = useState<'minha_cidade' | 'vizinhos' | 'mg_todo'>('mg_todo');
  const [selectedFilterCity, setSelectedFilterCity] = useState<string>(currentCity);

  // Lista dinâmica e índice atual do card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [cupidoModalOpen, setCupidoModalOpen] = useState(false);
  const [cupidoSuccess, setCupidoSuccess] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);
  const [profileDetailOpen, setProfileDetailOpen] = useState(false);

  // Filtragem dos perfis estritamente por Modo ativo e Localização
  const filteredProfiles = profiles.filter((p) => {
    if (p.mode !== mode) return false;
    if (locationScope === 'minha_cidade') {
      return p.city.toLowerCase() === selectedFilterCity.toLowerCase();
    }
    if (locationScope === 'vizinhos') {
      // Mesma região ou até 70km
      return (p.distanceKm && p.distanceKm <= 75) || p.city === selectedFilterCity;
    }
    return true; // Toda Minas Gerais
  });

  const activeCard = filteredProfiles[currentIndex];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCard) return;
    triggerHaptic('light');
    setCurrentPhotoIdx((prev) => (prev + 1) % activeCard.photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCard) return;
    triggerHaptic('light');
    setCurrentPhotoIdx((prev) => (prev - 1 + activeCard.photos.length) % activeCard.photos.length);
  };

  const handlePass = () => {
    triggerHaptic('medium');
    setCurrentPhotoIdx(0);
    setShowFullBio(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleLike = () => {
    triggerHaptic('success');
    if (activeCard) {
      // Simulação de match orgânico acolhedor
      setMatchedProfile(activeCard);
    }
  };

  const confirmMatch = () => {
    if (matchedProfile) {
      onOpenChat(matchedProfile);
      setMatchedProfile(null);
      setCurrentPhotoIdx(0);
      setShowFullBio(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleCupidoShare = () => {
    triggerHaptic('success');
    setCupidoSuccess(true);
    setTimeout(() => {
      setCupidoSuccess(false);
      setCupidoModalOpen(false);
      if (activeCard) {
        onOpenChat(
          activeCard,
          `Achei que esse perfil combina muito com você! Dá uma olhada no perfil de ${activeCard.name} de ${activeCard.city}!`
        );
      }
    }, 1200);
  };

  const handleResetCards = () => {
    triggerHaptic('light');
    setCurrentIndex(0);
    setCurrentPhotoIdx(0);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none pb-24">
      {/* 1. TOPO: Switch Global de Modo (Amor vs Amizade) + Filtro de Cidade/MG */}
      <div className="px-4 pt-1 pb-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          {/* Switch Global Amor / Amizade */}
          <div className="flex items-center bg-[#13131D] p-1 rounded-full border border-white/10 shadow-inner">
            <button
              onClick={() => {
                if (!isLove) toggleMode();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                isLove
                  ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_14px_rgba(255,0,127,0.7)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLove ? 'fill-current' : ''}`} />
              <span>Amor</span>
            </button>

            <button
              onClick={() => {
                if (isLove) toggleMode();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                !isLove
                  ? 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_14px_rgba(255,183,0,0.7)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Amizade</span>
            </button>
          </div>

          {/* Seletor rápido de Cidades de Minas */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedFilterCity}
              onChange={(e) => {
                setSelectedFilterCity(e.target.value);
                setCurrentCity(e.target.value);
                setCurrentIndex(0);
                triggerHaptic('light');
              }}
              className="bg-[#151522] text-xs text-white/90 border border-white/15 rounded-full px-3 py-1.5 outline-none focus:border-[#FF007F]"
            >
              {MG_CITIES.map((c) => (
                <option key={c} value={c} className="bg-[#101018] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Abas de Escopo Regional de MG */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => {
              setLocationScope('minha_cidade');
              setCurrentIndex(0);
              triggerHaptic('light');
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              locationScope === 'minha_cidade'
                ? isLove
                  ? 'bg-[#FF007F]/20 border border-[#FF007F] text-[#FF55A3]'
                  : 'bg-[#FFB700]/20 border border-[#FFB700] text-[#FFC933]'
                : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
            }`}
          >
            Em {selectedFilterCity}
          </button>

          <button
            onClick={() => {
              setLocationScope('vizinhos');
              setCurrentIndex(0);
              triggerHaptic('light');
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              locationScope === 'vizinhos'
                ? isLove
                  ? 'bg-[#FF007F]/20 border border-[#FF007F] text-[#FF55A3]'
                  : 'bg-[#FFB700]/20 border border-[#FFB700] text-[#FFC933]'
                : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
            }`}
          >
            Cidades Vizinhas (até 70 km)
          </button>

          <button
            onClick={() => {
              setLocationScope('mg_todo');
              setCurrentIndex(0);
              triggerHaptic('light');
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
              locationScope === 'mg_todo'
                ? isLove
                  ? 'bg-[#FF007F]/20 border border-[#FF007F] text-[#FF55A3]'
                  : 'bg-[#FFB700]/20 border border-[#FFB700] text-[#FFC933]'
                : 'bg-white/5 text-white/60 hover:text-white border border-transparent'
            }`}
          >
            Toda Minas Gerais
          </button>
        </div>
      </div>

      {/* 2. ÁREA CENTRAL DO SWIPE CARD */}
      <div className="flex-1 px-4 relative flex items-center justify-center min-h-[460px]">
        {activeCard ? (
          <div
            className="w-full h-full max-h-[570px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between bg-[#11111A]"
            style={{
              boxShadow: isLove
                ? '0 10px 40px -10px rgba(255, 0, 127, 0.35)'
                : '0 10px 40px -10px rgba(255, 183, 0, 0.35)',
            }}
          >
            {/* Foto de Fundo com Navegação por toque lateral */}
            <div className="absolute inset-0 z-0">
              <img
                src={activeCard.photos[currentPhotoIdx] || activeCard.photos[0]}
                alt={activeCard.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-black/60" />

              {/* Áreas de toque invisíveis para passar fotos */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10"
                onClick={handlePrevPhoto}
              />
              <div
                className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10"
                onClick={handleNextPhoto}
              />
            </div>

            {/* Topo do Card: Indicador de até 6 fotos com traços iluminados */}
            <div className="relative z-20 px-3 pt-3 flex gap-1">
              {activeCard.photos.slice(0, 6).map((_, idx) => (
                <div
                  key={idx}
                  className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      idx === currentPhotoIdx
                        ? isLove
                          ? 'bg-[#FF007F] shadow-[0_0_8px_#FF007F]'
                          : 'bg-[#FFB700] shadow-[0_0_8px_#FFB700]'
                        : idx < currentPhotoIdx
                        ? 'bg-white/80'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Badges superiores: Modo e Região */}
            <div className="relative z-20 px-4 pt-2 flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                  isLove
                    ? 'bg-[#FF007F]/30 border-[#FF007F]/60 text-white'
                    : 'bg-[#FFB700]/30 border-[#FFB700]/60 text-black font-extrabold'
                }`}
              >
                {isLove ? 'Amor em MG' : 'Amizade em MG'}
              </span>

              {/* Botão Cupido integrado no topo do card */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCupidoModalOpen(true);
                  triggerHaptic('light');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/50 border border-white/20 text-white backdrop-blur-md hover:bg-black/70 active:scale-95 transition-all"
                title="Cupido: Enviar este perfil a um amigo"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FF2A85]" />
                <span className="text-[11px]">Cupido</span>
              </button>
            </div>

            {/* Rodapé do Card: Identificação, Cidade de MG e Bio acolhedora */}
            <div className="relative z-20 p-5 mt-auto flex flex-col gap-2 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/85 to-transparent">
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {activeCard.name}, {activeCard.age}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-white/80 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF007F]" />
                    <span className="font-semibold text-white">{activeCard.city}</span>
                    <span className="text-white/50">• {activeCard.region}</span>
                    {activeCard.distanceKm && (
                      <span className="text-white/60">({activeCard.distanceKm} km)</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setProfileDetailOpen(true);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 active:scale-90 transition-all"
                  title="Ver perfil completo"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Bio Mineira e Interesses */}
              <p
                className={`text-xs text-white/90 leading-relaxed font-normal transition-all ${
                  showFullBio ? 'line-clamp-none' : 'line-clamp-2'
                }`}
              >
                {activeCard.bio}
              </p>

              {/* Tags de gostos típicos mineiros */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCard.interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 3. BOTÕES FLUTUANTES E LUMINOSOS NA BASE */}
              <div className="flex items-center justify-center gap-6 pt-3 pb-1">
                {/* Botão Pass / Próximo */}
                <button
                  onClick={handlePass}
                  className="w-14 h-14 rounded-full bg-[#181824] border border-white/15 text-white/60 flex items-center justify-center shadow-lg hover:text-white hover:border-white/30 active:scale-90 transition-all"
                  aria-label="Passar perfil"
                >
                  <X className="w-7 h-7" />
                </button>

                {/* Botão Match / Coração Luminoso */}
                <button
                  onClick={handleLike}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all ${
                    isLove
                      ? 'bg-gradient-to-tr from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_25px_rgba(255,0,127,0.7)]'
                      : 'bg-gradient-to-tr from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_25px_rgba(255,183,0,0.7)]'
                  }`}
                  aria-label="Dar like"
                >
                  <Heart className={`w-8 h-8 ${isLove ? 'fill-current' : 'fill-current'}`} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Estado Vazio Aconchegante quando acabam os cards */
          <div className="w-full h-full max-h-[500px] rounded-3xl bg-[#12121C] border border-white/10 p-6 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FF007F]/15 border border-[#FF007F]/30 flex items-center justify-center">
              <Coffee className="w-8 h-8 text-[#FF55A3]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Todos os perfis vistos por aqui!</h3>
              <p className="text-xs text-white/60 max-w-xs">
                Você conferiu as conexões de {selectedFilterCity} no modo {isLove ? 'Amor' : 'Amizade'}.
                Que tal expandir para Toda Minas Gerais ou rever os perfis?
              </p>
            </div>

            <button
              onClick={handleResetCards}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all active:scale-95 ${
                isLove
                  ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                  : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_15px_rgba(255,183,0,0.5)]'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ver Perfis Novamente</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL CUPIDO (Compartilhar perfil com um amigo) */}
      {cupidoModalOpen && activeCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#151522] border border-[#FF007F]/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-[#FF007F]/20 text-[#FF007F]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Botão Cupido</h4>
                  <p className="text-[11px] text-white/60">Apresente esse perfil a um amigo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCupidoModalOpen(false)}
                aria-label="Voltar para os perfis"
                className="flex shrink-0 items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
              <img
                src={activeCard.photos[0]}
                alt={activeCard.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-white">
                  {activeCard.name}, {activeCard.age}
                </p>
                <p className="text-[10px] text-white/60">
                  {activeCard.city} • {activeCard.occupation || 'MG'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-white/70 italic text-left">
              "Achei que esse perfil combina com você! Dá uma olhada e manda uma mensagem!"
            </p>

            <button
              onClick={handleCupidoShare}
              disabled={cupidoSuccess}
              className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                cupidoSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_15px_rgba(255,0,127,0.6)]'
              }`}
            >
              {cupidoSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enviado no Chat com Sucesso!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Enviar para Conversa</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL MATCH SURPRESA / CONEXÃO ESTABELECIDA */}
      {matchedProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#210D1D] to-[#120710] border border-[#FF007F]/50 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FF007F]/20 border border-[#FF007F] flex items-center justify-center text-[#FF007F] shadow-[0_0_20px_rgba(255,0,127,0.7)] animate-bounce">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white tracking-tight">Deu Encontro Certo!</h3>
              <p className="text-xs text-white/70">
                Você e <strong className="text-white">{matchedProfile.name}</strong> se curtiram em{' '}
                {matchedProfile.city}!
              </p>
            </div>

            <div className="flex items-center justify-center -space-x-4 py-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Você"
                className="w-16 h-16 rounded-full border-2 border-[#FF007F] object-cover shadow-lg"
              />
              <img
                src={matchedProfile.photos[0]}
                alt={matchedProfile.name}
                className="w-16 h-16 rounded-full border-2 border-[#FF2A85] object-cover shadow-lg"
              />
            </div>

            <div className="w-full flex flex-col gap-2 pt-2">
              <button
                onClick={confirmMatch}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,0,127,0.6)] active:scale-95"
              >
                Abrir Conversa Agora
              </button>
              <button
                onClick={() => setMatchedProfile(null)}
                className="w-full py-2.5 rounded-2xl bg-white/5 text-white/60 text-xs font-semibold hover:text-white"
              >
                Continuar Vendo Perfis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALHE DO PERFIL COMPLETO */}
      <ProfileDetailModal
        profile={activeCard || null}
        isOpen={profileDetailOpen}
        onClose={() => setProfileDetailOpen(false)}
        onLike={() => {
          setProfileDetailOpen(false);
          handleLike();
        }}
        onCupidoShare={() => {
          setProfileDetailOpen(false);
          setCupidoModalOpen(true);
        }}
      />
    </div>
  );
};
