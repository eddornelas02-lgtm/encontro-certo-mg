import React from 'react';
import { Compass, CalendarHeart, HeartHandshake, MessageCircle, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export type TabType = 'descobrir' | 'hoje' | 'matches' | 'conversas' | 'perfil';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChatsCount?: number;
  newMatchesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  unreadChatsCount = 1,
  newMatchesCount = 2,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  const tabs = [
    {
      id: 'descobrir' as TabType,
      label: 'Descobrir',
      icon: Compass,
    },
    {
      id: 'hoje' as TabType,
      label: 'Hoje em MG',
      icon: CalendarHeart,
    },
    {
      id: 'matches' as TabType,
      label: 'Partidas',
      icon: HeartHandshake,
      badge: newMatchesCount,
    },
    {
      id: 'conversas' as TabType,
      label: 'Conversas',
      icon: MessageCircle,
      badge: unreadChatsCount,
    },
    {
      id: 'perfil' as TabType,
      label: 'Meu Perfil',
      icon: User,
    },
  ];

  const handleSelect = (tab: TabType) => {
    triggerHaptic('light');
    onTabChange(tab);
  };

  const activeColor = isLove ? '#FF007F' : '#FFB700';
  const glowStyle = isLove
    ? '0 0 16px rgba(255, 0, 127, 0.65)'
    : '0 0 16px rgba(255, 183, 0, 0.65)';

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-3 pb-4 pt-1 pointer-events-auto">
      <div
        className="w-full backdrop-blur-2xl bg-[#0E0E17]/90 border border-white/10 rounded-3xl px-2 py-2 shadow-2xl flex items-center justify-around"
        style={{
          boxShadow: isLove
            ? '0 -6px 28px -4px rgba(255, 0, 127, 0.25), 0 12px 30px rgba(0,0,0,0.8)'
            : '0 -6px 28px -4px rgba(255, 183, 0, 0.25), 0 12px 30px rgba(0,0,0,0.8)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-300 ${
                isActive ? 'scale-105' : 'opacity-65 hover:opacity-90'
              } active:scale-95`}
            >
              <div
                className={`p-1.5 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? isLove
                      ? 'bg-[#FF007F]/20 text-[#FF007F]'
                      : 'bg-[#FFB700]/20 text-[#FFB700]'
                    : 'text-white/70'
                }`}
                style={{
                  boxShadow: isActive ? glowStyle : undefined,
                }}
              >
                <Icon className="w-5 h-5 transition-transform" />

                {tab.badge && tab.badge > 0 && !isActive && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${
                      isLove ? 'bg-[#FF007F]' : 'bg-[#FF8800]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium mt-0.5 tracking-tight ${
                  isActive
                    ? isLove
                      ? 'text-[#FF2A85] font-semibold'
                      : 'text-[#FFB700] font-semibold'
                    : 'text-white/60'
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5 transition-all"
                  style={{
                    backgroundColor: activeColor,
                    boxShadow: `0 0 8px ${activeColor}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
