import React, { useEffect, useId, useRef, useState } from 'react';
import { Heart, Pause, Play, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface AudioPlayerBubbleProps {
  audioUrl?: string;
  duration?: number;
  isSender?: boolean;
}

const WAVE_BARS = [
  22, 34, 48, 66, 84, 100, 88, 70, 54, 42, 32, 26,
  26, 32, 42, 54, 70, 88, 100, 84, 66, 48, 34, 22,
];

const AudioShape: React.FC<{ isLove: boolean; isPlaying: boolean; progress: number }> = ({
  isLove,
  isPlaying,
  progress,
}) => {
  const shapeId = `audio-shape-${useId().replace(/:/g, '')}`;
  const shapePath = isLove
    ? 'M50 88C45 83 12 61 12 35C12 18 25 10 38 10C45 10 50 14 50 21C50 14 55 10 62 10C75 10 88 18 88 35C88 61 55 83 50 88Z'
    : 'M50 6L61 35L94 38L68 58L76 90L50 72L24 90L32 58L6 38L39 35Z';
  const activeColor = isLove ? '#FF007F' : '#FFB700';
  const inactiveColor = 'rgba(255, 255, 255, 0.2)';

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label={isLove ? 'Ondas de áudio em formato de coração' : 'Ondas de áudio em formato de estrela da amizade'}
      className={`h-9 w-full overflow-visible ${isPlaying ? 'animate-pulse-subtle' : ''}`}
    >
      <defs>
        <clipPath id={shapeId}>
          <path d={shapePath} />
        </clipPath>
      </defs>

      <path
        d={shapePath}
        fill={isLove ? 'rgba(255, 0, 127, 0.08)' : 'rgba(255, 183, 0, 0.08)'}
        stroke={isLove ? 'rgba(255, 85, 163, 0.75)' : 'rgba(255, 214, 107, 0.75)'}
        strokeWidth="2"
      />

      <g clipPath={`url(#${shapeId})`} className={isPlaying ? 'audio-wave-bars-playing' : ''}>
        {WAVE_BARS.map((bar, index) => {
          const x = 5 + index * 3.9;
          const height = 12 + bar * 0.58;
          const y = 50 - height / 2;
          const isFilled = progress >= (index / WAVE_BARS.length) * 100;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width="2.8"
              height={height}
              rx="1.4"
              fill={isFilled ? activeColor : inactiveColor}
              style={{ animationDelay: `${index * 45}ms` }}
            />
          );
        })}
      </g>
    </svg>
  );
};

export const AudioPlayerBubble: React.FC<AudioPlayerBubbleProps> = ({
  duration = 18,
  isSender = false,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlayback = () => {
    triggerHaptic('light');
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setCurrentTime((previous) => {
        if (previous >= duration) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          setProgress(0);
          return 0;
        }
        const next = previous + 1;
        setProgress((next / duration) * 100);
        return next;
      });
    }, 1000);
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
      className={`relative max-w-[280px] p-3 transition-all duration-300 sm:max-w-xs ${
        isLove
          ? 'rounded-3xl border border-[#FF007F]/30 bg-gradient-to-r from-[#2B0E1E] via-[#1A0B16] to-[#0E0610] shadow-[0_4px_20px_rgba(255,0,127,0.25)]'
          : 'rounded-[2rem] border border-[#FFB700]/30 bg-gradient-to-r from-[#271E0B] via-[#1C1508] to-[#100C04] shadow-[0_4px_20px_rgba(255,183,0,0.25)]'
      } ${isSender ? 'ml-auto' : 'mr-auto'}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center transition-transform active:scale-90 ${
            isLove
              ? 'rounded-full bg-gradient-to-tr from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_15px_rgba(255,0,127,0.7)]'
              : 'rounded-full bg-gradient-to-tr from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_15px_rgba(255,183,0,0.7)]'
          }`}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 translate-x-0.5 fill-current" />}
          <span className="absolute -bottom-1 -right-1 rounded-full border border-white/20 bg-[#0A0A0F] p-0.5">
            {isLove ? (
              <Heart className="h-3 w-3 fill-[#FF007F] text-[#FF007F]" />
            ) : (
              <Sparkles className="h-3 w-3 text-[#FFB700]" />
            )}
          </span>
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 overflow-hidden">
          <AudioShape isLove={isLove} isPlaying={isPlaying} progress={progress} />
          <div className="flex items-center justify-between font-mono text-[10px] text-white/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
