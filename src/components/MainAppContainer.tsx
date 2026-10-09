import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { AndroidStatusBar } from '@/components/AndroidStatusBar';
import { GoogleAd } from '@/components/GoogleAd';
import { PresenceBadge } from '@/components/PresenceBadge';
import { BottomNavBar, TabType } from '@/components/BottomNavBar';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { HojeEmMGScreen } from '@/screens/HojeEmMGScreen';
import { MatchesScreen } from '@/screens/MatchesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { FAKE_PROFILES } from '@/data/fakeProfiles';
import { UserProfile } from '@/types';

export const MainAppContainer: React.FC = () => {
  const { mode, session, authLoading } = useApp();
  const isLove = mode === 'amor';

  // Navegação de Telas
  const [activeTab, setActiveTab] = useState<TabType>('descobrir');

  // Estado do Chat Ativo
  const [activeChatPartner, setActiveChatPartner] = useState<UserProfile | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);

  // Perfis de demonstração (NUNCA salvos no banco de dados)
  const [profiles] = useState<UserProfile[]>(FAKE_PROFILES);

  const handleOpenChat = (partner: UserProfile, message?: string) => {
    setActiveChatPartner(partner);
    setChatInitialMessage(message);
  };

  const handleCloseChat = () => {
    setActiveChatPartner(null);
    setChatInitialMessage(undefined);
  };

  const isAuthenticated = Boolean(session?.user);

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

        {/* 2. Tela de Carregamento inicial */}
        {authLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 z-10">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-[#FF007F] to-[#FF2A85] flex items-center justify-center shadow-[0_0_35px_rgba(255,0,127,0.55)] animate-pulse">
              <Heart className="w-10 h-10 text-white fill-current" />
            </div>
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Preparando o aconchego mineiro...</span>
            </div>
          </div>
        )}

        {/* 3. Cadastro / Login (quando não autenticado) */}
        {!authLoading && !isAuthenticated && (
          <main className="flex-1 flex flex-col relative overflow-hidden z-10">
            <AuthScreen />
          </main>
        )}

        {/* 4. Aplicativo principal (quando autenticado) */}
        {!authLoading && isAuthenticated && (
          <>
            {/* Badge de Presença Viva "Pessoas Online em Minas Agora" */}
            {!activeChatPartner && <PresenceBadge />}
            {!activeChatPartner && <GoogleAd />}

            <main className="flex-1 flex flex-col relative overflow-hidden z-10">
              {activeChatPartner ? (
                <ChatScreen
                  partner={activeChatPartner}
                  initialMessage={chatInitialMessage}
                  onBack={handleCloseChat}
                  onOpenPartnerProfile={() => {
                    // Abre aba de perfil
                    setActiveTab('perfil');
                    handleCloseChat();
                  }}
                />
              ) : (
                <>
                  {activeTab === 'descobrir' && (
                    <DiscoverScreen profiles={profiles} onOpenChat={handleOpenChat} />
                  )}

                  {activeTab === 'hoje' && (
                    <HojeEmMGScreen
                      onOpenChatWithAuthor={(author, text) => handleOpenChat(author, text)}
                    />
                  )}

                  {activeTab === 'matches' && (
                    <MatchesScreen profiles={profiles} onOpenChat={handleOpenChat} />
                  )}

                  {activeTab === 'conversas' && (
                    <MatchesScreen profiles={profiles} onOpenChat={handleOpenChat} />
                  )}

                  {activeTab === 'perfil' && <ProfileScreen />}
                </>
              )}
            </main>

            {/* Bottom Tab Bar Flutuante (oculta quando o chat está aberto) */}
            {!activeChatPartner && (
              <BottomNavBar
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                unreadChatsCount={1}
                newMatchesCount={profiles.filter((p) => p.mode === mode).length}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};