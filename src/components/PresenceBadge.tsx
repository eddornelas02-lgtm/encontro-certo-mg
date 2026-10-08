import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Flame, Users2, MapPin } from 'lucide-react';

export const PresenceBadge: React.FC = () => {
  const {
    presenceFilter,
    setPresenceFilter,
    onlineCityCount,
    onlineStateCount,
    currentCity,
    mode,
    triggerHaptic,
  } = useApp();

  const isLove = mode === 'amor';
  const glowColor = isLove ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 183, 0, 0.4)';
  const activeNumber = presenceFilter === 'cidade' ? onlineCityCount : onlineStateCount;

  const toggleFilter = () => {
    triggerHaptic('light');
    setPresenceFilter(presenceFilter === 'cidade' ? 'estado' : 'cidade');
  };

  return (
    <div className="w-full px-4 pt-1 pb-2 flex items-center justify-between z-40">
      <button
        onClick={toggleFilter}
        style={{
          boxShadow: `0 0 14px ${glowColor}`,
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 border ${
          isLove
            ? 'bg-[#180A15]/80 border-[#FF007F]/40 text-[#FF55A3]'
            : 'bg-[#1A1505]/80 border-[#FFB700]/40 text-[#FFC933]'
        } active:scale-95`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isLove ? 'bg-[#FF007F]' : 'bg-[#FFB700]'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isLove ? 'bg-[#FF007F]' : 'bg-[#FFB700]'
            }`}
          />
        </span>

        <span className="text-[11px] font-semibold tracking-wide">
          <strong className="text-white text-xs">{activeNumber}</strong>{' '}
          {presenceFilter === 'cidade' ? `online em ${currentCity}` : 'online em Minas Gerais'}
        </span>

        <span className="text-[10px] text-white/50 ml-1">
          ({presenceFilter === 'cidade' ? 'tocar p/ MG' : 'tocar p/ Cidade'})
        </span>
      </button>

      <div className="flex items-center gap-1.5 text-[11px] text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
        <MapPin className="w-3 h-3 text-[#FF55A3]" />
        <span className="font-medium text-white/80">{currentCity}</span>
      </div>
    </div>
  );
};
