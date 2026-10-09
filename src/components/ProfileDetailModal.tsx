import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Share2,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface ProfileDetailModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (profile: UserProfile) => void;
  onCupidoShare?: (profile: UserProfile) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  onClose,
  onLike,
  onCupidoShare,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!isOpen || !profile) return null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="w-full max-w-md bg-[#0F0F1A] border border-white/15 rounded-t-[32px] sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col shadow-2xl relative">
        {/* Carrossel de Fotos com Controles Touch */}
        <div className="relative w-full aspect-[4/5] bg-black">
          <img
            src={profile.photos[photoIndex] || profile.photos[0]}
            alt={profile.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-transparent to-black/60" />

          {/* Botão de retorno flutuante */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            aria-label="Voltar para o perfil"
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/65 px-3 py-2 text-[11px] font-bold text-white backdrop-blur-md transition-all hover:bg-black/90 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {/* Indicador de fotos (barrinhas) */}
          <div className="absolute top-3 left-4 right-14 flex gap-1 z-20">
            {profile.photos.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    idx === photoIndex
                      ? isLove
                        ? 'bg-[#FF007F]'
                        : 'bg-[#FFB700]'
                      : idx < photoIndex
                      ? 'bg-white/70'
                      : 'bg-transparent'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Navegação Manual com Botões Sutis */}
          {profile.photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 active:scale-90 z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 active:scale-90 z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Identificação Principal sobreposta */}
          <div className="absolute bottom-4 left-5 right-5 z-20">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {profile.name}, {profile.age}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-white/80 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF007F]" />
              <span className="font-semibold text-white">{profile.city}</span>
              <span className="text-white/50">• {profile.region}</span>
              {profile.distanceKm && (
                <span className="text-white/60">({profile.distanceKm} km)</span>
              )}
            </div>
          </div>
        </div>

        {/* Detalhes, Ocupação, Bio e Interesses */}
        <div className="p-5 flex flex-col gap-4">
          {profile.occupation && (
            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 px-3 py-2 rounded-2xl border border-white/10">
              <Briefcase className="w-4 h-4 text-[#FF55A3]" />
              <span>{profile.occupation}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              Sobre {profile.name.split(' ')[0]}
            </span>
            <p className="text-xs text-white/90 leading-relaxed font-normal bg-white/5 p-3.5 rounded-2xl border border-white/10">
              {profile.bio}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              Cantinhos & Preferências em MG
            </span>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/90 border border-white/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Garantia e Localização Segura */}
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Perfil verificado no estado de Minas Gerais. Livre de bots e contas automáticas.</span>
          </div>

          {/* Barra de Ações Rápidas no Rodapé */}
          <div className="flex items-center gap-3 pt-2 pb-3">
            {onCupidoShare && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onCupidoShare(profile);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/10 border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4 text-[#FF55A3]" />
                <span>Indicar (Cupido)</span>
              </button>
            )}

            {onLike && (
              <button
                onClick={() => {
                  triggerHaptic('success');
                  onLike(profile);
                  onClose();
                }}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl ${
                  isLove
                    ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] shadow-[0_0_18px_rgba(255,0,127,0.6)]'
                    : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_18px_rgba(255,183,0,0.6)]'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{isLove ? 'Conectar (Amor)' : 'Conectar (Amizade)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
