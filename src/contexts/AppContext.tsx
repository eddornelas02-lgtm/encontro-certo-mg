import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { Mode, UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';
import {
  loadOrCreateMyProfiles,
  saveProfile,
  translateAuthError,
} from '@/lib/profiles';

interface SignUpResult {
  ok?: boolean;
  error?: string;
  needsConfirmation?: boolean;
}

interface AppContextType {
  // Autenticação (e-mail + senha)
  session: Session | null;
  authLoading: boolean;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ ok?: boolean; error?: string }>;

  // Modo Global: 'amor' (padrão) | 'amizade'
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;

  // Usuário Atual e Cidade selecionada em MG
  currentCity: string;
  setCurrentCity: (city: string) => void;
  userLoveProfile: UserProfile;
  userFriendProfile: UserProfile;
  activeProfile: UserProfile;
  updateProfile: (mode: Mode, partial: Partial<UserProfile>) => void;

  // Presença realista em tempo real (últimas 2 horas, sem bots)
  onlineCityCount: number;
  onlineStateCount: number;
  presenceFilter: 'cidade' | 'estado';
  setPresenceFilter: (f: 'cidade' | 'estado') => void;

  // Haptic feedback simulado nativo Android
  triggerHaptic: (type?: 'light' | 'medium' | 'success' | 'warning') => void;
}

const DEFAULT_LOVE_PROFILE: UserProfile = {
  id: 'me-love',
  user_id: 'current-user-id',
  name: 'Você (Mineiro/a)',
  age: 26,
  city: 'Belo Horizonte',
  city_code: 3106200,
  region: 'Central / Belo Horizonte',
  mode: 'amor',
  bio: 'Gosto de prosa boa, pão de queijo quentinho e descobrir cantinhos charmosos por Minas. Aberto a conexões sinceras e acolhedoras.',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  ],
  interests: ['Café Mineiro', 'Música Boa', 'Viagens por MG', 'Savassi'],
  occupation: 'Profissional Criativo',
  updated_at: new Date().toISOString(),
};

const DEFAULT_FRIEND_PROFILE: UserProfile = {
  id: 'me-friend',
  user_id: 'current-user-id',
  name: 'Você (Modo Amizade)',
  age: 26,
  city: 'Belo Horizonte',
  city_code: 3106200,
  region: 'Central / Belo Horizonte',
  mode: 'amizade',
  bio: 'Procurando parcerias para trilhas, rolês gastronômicos por BH e cidades históricas, e um papo leve regado a café de coador.',
  photos: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  ],
  interests: ['Trilhas', 'Cafeterias', 'Jogos de Tabuleiro', 'Futebol'],
  occupation: 'Profissional Criativo',
  updated_at: new Date().toISOString(),
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Autenticação
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. O modo Amor é o padrão estrito ao abrir o app
  const [mode, setMode] = useState<Mode>('amor');
  const [currentCity, setCurrentCity] = useState<string>('Belo Horizonte');

  // Perfis 100% independentes no banco: Amor e Amizade
  const [userLoveProfile, setUserLoveProfile] = useState<UserProfile>(DEFAULT_LOVE_PROFILE);
  const [userFriendProfile, setUserFriendProfile] = useState<UserProfile>(DEFAULT_FRIEND_PROFILE);

  // Presença online realista
  const [presenceFilter, setPresenceFilter] = useState<'cidade' | 'estado'>('cidade');
  const [onlineCityCount, setOnlineCityCount] = useState<number>(1);
  const [onlineStateCount, setOnlineStateCount] = useState<number>(1);

  // Vibração nativa Android (Haptic Feedback)
  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'light':
            navigator.vibrate(12);
            break;
          case 'medium':
            navigator.vibrate(28);
            break;
          case 'success':
            navigator.vibrate([15, 30, 25]);
            break;
          case 'warning':
            navigator.vibrate([40, 40, 40]);
            break;
        }
      } catch {
        // Fallback silencioso
      }
    }
  };

  const toggleMode = () => {
    triggerHaptic('medium');
    setMode((prev) => (prev === 'amor' ? 'amizade' : 'amor'));
  };

  // Carrega os perfis reais do usuário autenticado
  const hydrateProfiles = async (user: User) => {
    const { love, friend } = await loadOrCreateMyProfiles(user);
    setUserLoveProfile(love);
    setUserFriendProfile(friend);
    if (love.city) setCurrentCity(love.city);
  };

  // Sessão inicial + observador de autenticação
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        loadOrCreateMyProfiles(data.session.user)
          .then(({ love, friend }) => {
            if (!mounted) return;
            setUserLoveProfile(love);
            setUserFriendProfile(friend);
            setCurrentCity(love.city);
          })
          .catch((err) => console.warn('Perfil real indisponível:', err));
      }
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Adiado para não travar o callback do Supabase
        setTimeout(() => {
          loadOrCreateMyProfiles(newSession.user)
            .then(({ love, friend }) => {
              setUserLoveProfile(love);
              setUserFriendProfile(friend);
              setCurrentCity(love.city);
            })
            .catch((err) => console.warn('Perfil real indisponível:', err));
        }, 0);
      } else {
        setUserLoveProfile(DEFAULT_LOVE_PROFILE);
        setUserFriendProfile(DEFAULT_FRIEND_PROFILE);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Cadastro com e-mail + senha garantindo options.emailRedirectTo = window.location.origin
  const signUp = async (email: string, password: string): Promise<SignUpResult> => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRedirectTo = window.location.origin;

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { emailRedirectTo },
    });

    if (error) {
      let errorMessage = translateAuthError(error.message);
      if (
        error.message.toLowerCase().includes('email') ||
        error.message.toLowerCase().includes('smtp') ||
        error.message.toLowerCase().includes('mail')
      ) {
        errorMessage += ' Verifique se o SMTP está configurado no painel do Supabase.';
      }
      return { error: errorMessage };
    }

    if (data.session?.user) {
      try {
        await hydrateProfiles(data.session.user);
      } catch (err: any) {
        return { error: `Conta criada, mas houve um erro ao salvar seu perfil: ${err?.message ?? ''}` };
      }
      return { ok: true };
    }

    // Caso a confirmação de e-mail esteja ativada no projeto
    if (data.user && !data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (signInError) {
        return { ok: true, needsConfirmation: true };
      }
      return { ok: true };
    }

    return { ok: true };
  };

  const resendConfirmationEmail = async (email: string): Promise<{ ok?: boolean; error?: string }> => {
    try {
      const emailRedirectTo = window.location.origin;
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo },
      });
      if (error) {
        let msg = translateAuthError(error.message);
        if (
          error.message.toLowerCase().includes('email') ||
          error.message.toLowerCase().includes('smtp') ||
          error.message.toLowerCase().includes('mail')
        ) {
          msg += ' Verifique se o SMTP está configurado no painel do Supabase.';
        }
        return { error: msg };
      }
      return { ok: true };
    } catch (err: any) {
      return { error: translateAuthError(err?.message || 'Falha ao reenviar e-mail.') };
    }
  };

  const signIn = async (email: string, password: string): Promise<SignUpResult> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { error: translateAuthError(error.message) };
    return { ok: true };
  };

  const signOut = async () => {
    triggerHaptic('medium');
    await supabase.auth.signOut();
    setUserLoveProfile(DEFAULT_LOVE_PROFILE);
    setUserFriendProfile(DEFAULT_FRIEND_PROFILE);
  };

  const updateProfile = (targetMode: Mode, partial: Partial<UserProfile>) => {
    triggerHaptic('success');
    const current = targetMode === 'amor' ? userLoveProfile : userFriendProfile;
    const next: UserProfile = {
      ...current,
      ...partial,
      mode: targetMode,
      updated_at: new Date().toISOString(),
    };

    if (targetMode === 'amor') setUserLoveProfile(next);
    else setUserFriendProfile(next);

    if (session?.user) {
      saveProfile(session.user.id, next).catch((err) =>
        console.warn('Não foi possível salvar o perfil no banco:', err)
      );
    }
  };

  // Heartbeat e contagem de presença (usa RPCs reais do Supabase quando logado)
  useEffect(() => {
    let heartbeatInterval: any;

    const registerHeartbeat = async () => {
      let cityCount = 1;
      let stateCount = 1;

      if (session?.user) {
        try {
          await supabase.rpc('heartbeat', { p_mode: mode });
          const { data: c } = await supabase.rpc('online_count', { p_city: currentCity });
          const { data: s } = await supabase.rpc('online_count', { p_city: null });
          cityCount = Math.max(1, Number(c) || 1);
          stateCount = Math.max(1, Number(s) || 1);
        } catch {
          // Mantém fallback local abaixo
        }
      }

      setOnlineCityCount(cityCount);
      setOnlineStateCount(Math.max(stateCount, cityCount));
    };

    registerHeartbeat();
    heartbeatInterval = setInterval(registerHeartbeat, 30000);

    return () => clearInterval(heartbeatInterval);
  }, [currentCity, mode, session]);

  const activeProfile = mode === 'amor' ? userLoveProfile : userFriendProfile;

  return (
    <AppContext.Provider
      value={{
        session,
        authLoading,
        signUp,
        signIn,
        signOut,
        resendConfirmationEmail,
        mode,
        setMode,
        toggleMode,
        currentCity,
        setCurrentCity,
        userLoveProfile,
        userFriendProfile,
        activeProfile,
        updateProfile,
        onlineCityCount,
        onlineStateCount,
        presenceFilter,
        setPresenceFilter,
        triggerHaptic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};
