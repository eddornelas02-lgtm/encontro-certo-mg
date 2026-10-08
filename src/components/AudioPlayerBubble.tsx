import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Smile } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface AudioPlayerBubbleProps {
  audioUrl?: string;
  duration?: number;
  isSender?: boolean;
}

export const AudioPlayerBubble: React.FC<AudioPlayerBubbleProps> = ({
  audioUrl,
  duration = 18,
  isSender = false,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<any>(null);

  // Geração de barras estéticas de onda sonora com padrão relaxante
  const waveBars = [
    30, 60, 45, 80, 100, 70, 90, 50, 40, 85, 75, 95, 60, 40, 70, 55, 90, 65, 45, 30,
  ];

  const togglePlayback = () => {
    triggerHaptic('light');
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            setProgress(0);
            return 0;
          }
          const next = prev + 1;
          setProgress((next / duration) * 100);
          return next;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div
      className={`relative p-3 transition-all duration-300 max-w-[280px] sm:max-w-xs ${
        isLove
          ? // Match de Amor: balão e botão em formato orgânico de coração estilizado com Magenta Neon
            'rounded-3xl border border-[#FF007F]/30 bg-gradient-to-r from-[#2B0E1E] via-[#1A0B16] to-[#0E0610] shadow-[0_4px_20px_rgba(255,0,127,0.25)]'
          : // Match de Amizade: formato curvo estilizado de sorriso / infinito em Dourado Âmbar
            'rounded-[2rem] border border-[#FFB700]/30 bg-gradient-to-r from-[#271E0B] via-[#1C1508] to-[#100C04] shadow-[0_4px_20px_rgba(255,183,0,0.25)]'
      } ${isSender ? 'ml-auto' : 'mr-auto'}`}
    >
      <div className="flex items-center gap-3">
        {/* Botão Play/Pause estilizado */}
        <button
          onClick={togglePlayback}
          className={`relative w-11 h-11 flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
            isLove
              ? 'rounded-full bg-gradient-to-tr from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_15px_rgba(255,0,127,0.7)]'
              : 'rounded-full bg-gradient-to-tr from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_15px_rgba(255,183,0,0.7)]'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}

          {/* Micro-ícone decorativo: Coração no Amor / Sorriso na Amizade */}
          <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#0A0A0F] border border-white/20">
            {isLove ? (
              <Heart className="w-3 h-3 text-[#FF007F] fill-[#FF007F]" />
            ) : (
              <Smile className="w-3 h-3 text-[#FFB700]" />
            )}
          </span>
        </button>

        {/* Linha de onda sonora + Tempo */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center gap-0.5 h-6">
            {waveBars.map((barHeight, idx) => {
              const barProgress = (idx / waveBars.length) * 100;
              const isFilled = progress >= barProgress;

              return (
                <div
                  key={idx}
                  className="flex-1 rounded-full transition-all duration-200"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: isFilled
                      ? isLove
                        ? '#FF007F'
                        : '#FFB700'
                      : 'rgba(255, 255, 255, 0.2)',
                    boxShadow:
                      isFilled && isPlaying
                        ? isLove
                          ? '0 0 6px #FF007F'
                          : '0 0 6px #FFB700'
                        : 'none',
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/60 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
