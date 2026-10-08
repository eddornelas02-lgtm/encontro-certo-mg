import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { AndroidStatusBar } from '@/components/AndroidStatusBar';
import { PresenceBadge } from '@/components/PresenceBadge';
import { BottomNavBar, TabType } from '@/components/BottomNavBar';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { HojeEmMGScreen } from '@/screens/HojeEmMGScreen';
import { MatchesScreen } from '@/screens/MatchesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { INITIAL_USER_PROFILES, UserProfile } from '@/types';

export const MainAppContainer: React.FC = () => {
  const { mode } = useApp();
  const isLove = mode === 'amor';

  // Navegação de Telas
  const [activeTab, setActiveTab] = useState<TabType>('descobrir');

  // Estado do Chat Ativo
  const [activeChatPartner, setActiveChatPartner] = useState<UserProfile | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);

  // Perfis da base
  const [profiles] = useState<UserProfile[]>(INITIAL_USER_PROFILES);

  const handleOpenChat = (partner: UserProfile, message?: string) => {
    setActiveChatPartner(partner);
    setChatInitialMessage(message);
  };

  const handleCloseChat = () => {
    setActiveChatPartner(null);
    setChatInitialMessage(undefined);
  };

  return (
    <div className="w-full min-h-screen bg-[#07070B] flex justify-center items-center p-0 sm:p-4">
      {/* Container simulando Smartphone Android com cantos arredondados (rounded-3xl) */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[844px] bg-[#0A0A0F] text-white flex flex-col relative overflow-hidden sm:rounded-[40px] sm:border-[6px] sm:border-[#1E1E2C] sm:shadow-2xl">
        {/* Camada difusa de iluminação acolhedora (Glow Layer) */}
        <div
          className={`absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors duration-700 ${
            isLove ? 'bg-[#FF007F]/25' : 'bg-[#FFB700]/25'
          }`}
        />
        <div
          className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-colors duration-700 ${
            isLove ? 'bg-[#FF2A85]/20' : 'bg-[#FF8800]/20'
          }`}
        />

        {/* 1. Status Bar Android Nativa */}
        <AndroidStatusBar />

        {/* 2. Badge de Presença Viva "Pessoas Online em Minas Agora" (fixada no topo) */}
        {!activeChatPartner && <PresenceBadge />}

        {/* 3. Área Principal de Telas */}
        <main className="flex-1 flex flex-col relative overflow-hidden z-10">
          {activeChatPartner ? (
            <ChatScreen
              partner={activeChatPartner}
              initialMessage={chatInitialMessage}
              onBack={handleCloseChat}
              onOpenPartnerProfile={(partner) => {
                // Abre aba de perfil com as fotos do parceiro
                setActiveTab('perfil');
                handleCloseChat();
              }}
            />
          ) : (
            <>
              {activeTab === 'descobrir' && (
                <DiscoverScreen
                  profiles={profiles}
                  onOpenChat={handleOpenChat}
                />
              )}

              {activeTab === 'hoje' && (
                <HojeEmMGScreen
                  onOpenChatWithAuthor={(author, text) => handleOpenChat(author, text)}
                />
              )}

              {activeTab === 'matches' && (
                <MatchesScreen
                  profiles={profiles}
                  onOpenChat={handleOpenChat}
                />
              )}

              {activeTab === 'conversas' && (
                <MatchesScreen
                  profiles={profiles}
                  onOpenChat={handleOpenChat}
                />
              )}

              {activeTab === 'perfil' && <ProfileScreen />}
            </>
          )}
        </main>

        {/* 4. Bottom Tab Bar Flutuante e Translúcida (oculta quando chat estiver aberto) */}
        {!activeChatPartner && (
          <BottomNavBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            unreadChatsCount={1}
            newMatchesCount={profiles.filter((p) => p.mode === mode).length}
          />
        )}
      </div>
    </div>
  );
};
