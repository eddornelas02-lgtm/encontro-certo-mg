import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-6 pt-2 pb-1 bg-transparent text-white/90 text-xs select-none tracking-tight z-50">
      <div className="font-semibold text-xs tracking-wider">{currentTime || '12:00'}</div>
      <div className="flex items-center gap-2 text-white/80">
        <SignalHigh className="w-3.5 h-3.5 text-white/90" />
        <Wifi className="w-3.5 h-3.5 text-white/90" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-medium text-white/80">88%</span>
          <BatteryMedium className="w-4 h-4 text-white/90" />
        </div>
      </div>
    </div>
  );
};
