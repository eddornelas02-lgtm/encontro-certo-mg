import React from 'react';
import { HeartHandshake, MapPin, MessageCircle, Sparkles, Heart } from 'lucide-react';
import { UserProfile, MatchItem } from '@/types';
import { useApp } from '@/contexts/AppContext';

interface MatchesScreenProps {
  profiles: UserProfile[];
  onOpenChat: (profile: UserProfile) => void;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  profiles,
  onOpenChat,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  // Filtra as conexões correspondentes ao modo atual
  const matchesList = profiles.filter((p) => p.mode === mode);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar select-none px-4 pt-1 pb-28">
      {/* Cabeçalho */}
      <div className="py-2 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <HeartHandshake
              className={`w-6 h-6 ${isLove ? 'text-[#FF007F]' : 'text-[#FFB700]'}`}
            />
            Suas Partidas em MG
          </h2>
          <p className="text-[11px] text-white/60">
            Pessoas com sintonia mútua no modo {isLove ? 'Amor' : 'Amizade'}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            isLove
              ? 'bg-[#FF007F]/20 text-[#FF55A3] border border-[#FF007F]/40'
              : 'bg-[#FFB700]/20 text-[#FFC933] border border-[#FFB700]/40'
          }`}
        >
          {matchesList.length} Conexões
        </span>
      </div>

      {/* Grid de Novas Partidas Rápidas */}
      <div className="py-3">
        <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
          Novas Conexões Recentes
        </h3>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {matchesList.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                triggerHaptic('light');
                onOpenChat(item);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group active:scale-95 transition-all"
            >
              <div
                className={`relative p-0.5 rounded-full border-2 ${
                  isLove
                    ? 'border-[#FF007F] shadow-[0_0_12px_rgba(255,0,127,0.5)]'
                    : 'border-[#FFB700] shadow-[0_0_12px_rgba(255,183,0,0.5)]'
                }`}
              >
                <img
                  src={item.photos[0]}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 p-1 rounded-full bg-[#0A0A0F] border border-white/20">
                  {isLove ? (
                    <Heart className="w-2.5 h-2.5 text-[#FF007F] fill-[#FF007F]" />
                  ) : (
                    <Sparkles className="w-2.5 h-2.5 text-[#FFB700]" />
                  )}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white truncate max-w-[70px]">
                {item.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Conversas em Andamento */}
      <div className="mt-2 flex flex-col gap-2.5">
        <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">
          Histórico e Conversas
        </h3>

        {matchesList.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              triggerHaptic('light');
              onOpenChat(item);
            }}
            className="p-3 rounded-2xl bg-[#141422] border border-white/10 hover:border-white/20 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={item.photos[0]}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#141422]" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {item.name}, {item.age}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-white/60">
                  <MapPin className="w-3 h-3 text-[#FF55A3]" />
                  <span>{item.city}</span>
                </div>
                <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5">
                  {item.bio}
                </p>
              </div>
            </div>

            <button className="p-2 rounded-xl bg-white/5 text-white/70 hover:text-white">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
