import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Music,
  CloudSun,
  Mic,
  Square,
  Send,
  Sparkles,
  Gamepad2,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  UserProfile,
  ChatMessage,
  YouTubeSyncState,
  ChatClima,
} from '@/types';
import { useApp } from '@/contexts/AppContext';
import { AudioPlayerBubble } from '@/components/AudioPlayerBubble';
import { YouTubeSyncModal } from '@/components/YouTubeSyncModal';
import { ChatGamesModal } from '@/components/ChatGamesModal';

interface ChatScreenProps {
  partner: UserProfile;
  initialMessage?: string;
  onBack: () => void;
  onOpenPartnerProfile: (partner: UserProfile) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  partner,
  initialMessage,
  onBack,
  onOpenPartnerProfile,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  // Mensagens
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const list: ChatMessage[] = [
      {
        id: 'msg-init-1',
        chat_id: 'chat-active',
        sender_id: partner.user_id,
        type: 'text',
        content: `Oi! Que bom que deu certo o nosso encontro por aqui em ${partner.city}! Como está seu dia?`,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
    ];

    if (initialMessage) {
      list.push({
        id: 'msg-init-2',
        chat_id: 'chat-active',
        sender_id: 'me',
        type: 'text',
        content: initialMessage,
        created_at: new Date().toISOString(),
      });
    }

    return list;
  });

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const recordingIntervalRef = useRef<any>(null);

  // Clima e Ambiência de MG com sons suaves a 15% de volume
  const [currentClima, setCurrentClima] = useState<ChatClima>('padrao');
  const [climaAudioActive, setClimaAudioActive] = useState(false);
  const audioAmbienteRef = useRef<HTMLAudioElement | null>(null);

  // Modais de YouTube e Jogos
  const [ytModalOpen, setYtModalOpen] = useState(false);
  const [ytSyncState, setYtSyncState] = useState<YouTubeSyncState | null>(null);
  const [gamesModalOpen, setGamesModalOpen] = useState(false);
  const [gameCategory, setGameCategory] = useState<'conexao' | 'diversao'>('conexao');
  const [climaModalOpen, setClimaModalOpen] = useState(false);

  // Auto scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 11. TERMÔMETRO DE RECIPROCIDADE E ENERGIA ---
  // A cada 10 mensagens trocadas, calcula o total de caracteres enviados por cada usuário
  const totalCharsUser = messages
    .filter((m) => m.sender_id === 'me' && m.type === 'text')
    .reduce((sum, m) => sum + m.content.length, 0);

  const totalCharsPartner = messages
    .filter((m) => m.sender_id !== 'me' && m.type === 'text')
    .reduce((sum, m) => sum + m.content.length, 0);

  const totalCharsCombined = totalCharsUser + totalCharsPartner || 1;
  const userRatio = totalCharsUser / totalCharsCombined;
  const partnerRatio = totalCharsPartner / totalCharsCombined;

  // Estados do termômetro
  let termometroStatus: 'equilibrado' | 'usuario_fala_muito' | 'partner_fala_muito' | 'esfriando' =
    'equilibrado';
  let termometroDica = 'Sintonia equilibrada! A conversa está fluindo com energia gostosa.';

  if (userRatio > 0.75) {
    termometroStatus = 'usuario_fala_muito';
    termometroDica = 'Que tal fazer uma pergunta agora para ouvir o outro lado?';
  } else if (partnerRatio > 0.75) {
    termometroStatus = 'partner_fala_muito';
    termometroDica = 'Desenvolva mais suas respostas, o papo pode esfriar!';
  }

  // Envio de Texto
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    triggerHaptic('light');
    const nova: ChatMessage = {
      id: `msg-${Date.now()}`,
      chat_id: 'chat-active',
      sender_id: 'me',
      type: 'text',
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, nova]);
    setInputText('');

    // Resposta acolhedora automática simulada em 3 segundos
    setTimeout(() => {
      const resp: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        chat_id: 'chat-active',
        sender_id: partner.user_id,
        type: 'text',
        content:
          'Que legal! Aqui em ' +
          partner.city +
          ' o clima tá ótimo hoje. Já conhece os cantinhos tradicionais daqui?',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, resp]);
    }, 2800);
  };

  // --- 8. GRAVAÇÃO DE ÁUDIO NATIVA ANDROID ---
  const handleStartRecording = () => {
    triggerHaptic('medium');
    setIsRecording(true);
    setRecordTimer(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordTimer((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecordingAndSend = () => {
    triggerHaptic('success');
    clearInterval(recordingIntervalRef.current);
    setIsRecording(false);

    const dur = Math.max(3, recordTimer);
    const audioMsg: ChatMessage = {
      id: `msg-audio-${Date.now()}`,
      chat_id: 'chat-active',
      sender_id: 'me',
      type: 'audio',
      content: 'Mensagem de voz',
      audio_duration: dur,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, audioMsg]);
    setRecordTimer(0);
  };

  const handleCancelRecording = () => {
    triggerHaptic('warning');
    clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordTimer(0);
  };

  // --- 10. CLIMAS DE MG E SONS AMBIENTE SINCRONIZADOS ---
  const applyClima = (clima: ChatClima) => {
    triggerHaptic('light');
    setCurrentClima(clima);
    setClimaModalOpen(false);
    setClimaAudioActive(true);

    // Sistema de áudio sintetizado relaxante Web Audio API (volume a 15%)
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 15% de volume conforme especificação
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(clima === 'chuva_fazenda' ? 140 : 220, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setTimeout(() => {
          try {
            osc.stop();
            ctx.close();
          } catch {}
        }, 12000);
      }
    } catch {}
  };

  // Fundo dinâmico conforme o clima
  const getClimaBackground = () => {
    switch (currentClima) {
      case 'por_do_sol':
        return 'bg-gradient-to-b from-[#2B1017] via-[#1F0C15] to-[#0A0A0F]';
      case 'ouro_preto':
        return 'bg-gradient-to-b from-[#241A0B] via-[#171107] to-[#0A0A0F]';
      case 'chuva_fazenda':
        return 'bg-gradient-to-b from-[#091522] via-[#060D17] to-[#0A0A0F]';
      default:
        return 'bg-[#0A0A0F]';
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden select-none pb-2 transition-colors duration-700 ${getClimaBackground()}`}
    >
      {/* 1. TOPO DA CONVERSA: Navegação, Parceiro, YouTube, Clima e Termômetro */}
      <div className="px-3 pt-2 pb-2 bg-[#0E0E18]/90 backdrop-blur-md border-b border-white/10 flex flex-col gap-2 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                onBack();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Avatar Clicável para ver perfil */}
            <div
              onClick={() => onOpenPartnerProfile(partner)}
              className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="relative">
                <img
                  src={partner.photos[0]}
                  alt={partner.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black" />
              </div>

              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1">
                  {partner.name}
                </h3>
                <p className="text-[10px] text-white/60">
                  {partner.city} • {partner.mode === 'amor' ? 'Modo Amor' : 'Modo Amizade'}
                </p>
              </div>
            </div>
          </div>

          {/* Botões do Topo: Ouvir Música Juntos & Mudar Clima */}
          <div className="flex items-center gap-1.5">
            {/* Botão Ouvir Música Juntos */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setYtModalOpen(true);
              }}
              className={`p-2 rounded-full border transition-all active:scale-95 ${
                ytSyncState?.is_playing
                  ? isLove
                    ? 'bg-[#FF007F] text-white border-[#FF007F] shadow-[0_0_12px_#FF007F] animate-pulse'
                    : 'bg-[#FFB700] text-black border-[#FFB700] shadow-[0_0_12px_#FFB700] animate-pulse'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
              title="Ouvir Música Juntos (YouTube Sync)"
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Botão Mudar Clima de MG */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setClimaModalOpen(true);
              }}
              className={`p-2 rounded-full border transition-all active:scale-95 ${
                currentClima !== 'padrao'
                  ? 'bg-white/15 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
              }`}
              title="Mudar Clima e Ambiência de MG"
            >
              <CloudSun className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 11. TERMÔMETRO DE ENERGIA DA CONVERSA (Atualizado a cada 10 mensagens) */}
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/60">Termômetro de Reciprocidade:</span>
            <span
              className={`font-semibold ${
                termometroStatus === 'equilibrado' ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {termometroStatus === 'equilibrado' ? 'Alta Sintonia' : 'Atenção ao Ritmo'}
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                termometroStatus === 'equilibrado'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
              }`}
              style={{ width: `${Math.min(100, Math.max(15, userRatio * 100))}%` }}
            />
          </div>

          <p className="text-[9px] text-white/50 italic truncate">{termometroDica}</p>
        </div>
      </div>

      {/* 2. ÁREA DE MENSAGENS COM ROLAGEM */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 no-scrollbar">
        {messages.map((msg) => {
          const isSender = msg.sender_id === 'me';

          // Mensagem de Áudio Nativa com design Amor / Amizade
          if (msg.type === 'audio') {
            return (
              <div key={msg.id} className="w-full flex">
                <AudioPlayerBubble
                  audioUrl={msg.audio_url}
                  duration={msg.audio_duration}
                  isSender={isSender}
                />
              </div>
            );
          }

          // Mensagem de Card de Jogo
          if (msg.type === 'game') {
            return (
              <div
                key={msg.id}
                className="w-full max-w-xs mx-auto p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-center text-xs text-white"
              >
                <div className="flex items-center justify-center gap-1.5 text-[#FFB700] mb-1 font-bold text-[11px]">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Dinâmica de Conexão</span>
                </div>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            );
          }

          // Mensagem de Cupido Compartilhada
          if (msg.type === 'cupido') {
            return (
              <div
                key={msg.id}
                onClick={() => {
                  if (msg.cupido_profile) onOpenPartnerProfile(msg.cupido_profile);
                }}
                className="w-full max-w-xs mx-auto p-3.5 rounded-3xl bg-gradient-to-r from-[#2B0E1E] to-[#120710] border border-[#FF007F]/50 shadow-xl cursor-pointer active:scale-95 transition-all text-left"
              >
                <div className="flex items-center gap-1.5 text-[#FF2A85] text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Indicação do Cupido</span>
                </div>

                {msg.cupido_profile && (
                  <div className="flex items-center gap-3">
                    <img
                      src={msg.cupido_profile.photos[0]}
                      alt={msg.cupido_profile.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#FF007F]/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {msg.cupido_profile.name}, {msg.cupido_profile.age}
                      </h4>
                      <p className="text-[10px] text-white/70">{msg.cupido_profile.city}</p>
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-white/80 mt-2 italic">{msg.content}</p>
              </div>
            );
          }

          // Mensagem de Texto Padrão
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[78%] sm:max-w-[70%] ${
                isSender ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`px-4 py-2.5 rounded-3xl text-xs leading-relaxed transition-all ${
                  isSender
                    ? isLove
                      ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_2px_14px_rgba(255,0,127,0.35)] rounded-br-sm'
                      : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black font-medium shadow-[0_2px_14px_rgba(255,183,0,0.35)] rounded-br-sm'
                    : 'bg-[#181826] text-white/95 border border-white/10 rounded-bl-sm shadow-md'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[9px] text-white/40 mt-1 px-1">
                {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. BARRA INFERIOR DE AÇÕES E BOTÕES "CONEXÃO" & "DIVERSÃO" */}
      <div className="px-3 pt-1 pb-2 bg-[#0E0E18]/90 backdrop-blur-md border-t border-white/10 flex flex-col gap-2">
        {/* Botões Visuais de Ação: "Conexão" e "Diversão" */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              setGameCategory('conexao');
              setGamesModalOpen(true);
            }}
            className="flex-1 py-1.5 px-3 rounded-full bg-white/5 border border-white/10 hover:border-[#FF007F]/40 flex items-center justify-center gap-1.5 text-xs text-white/80 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF2A85]" />
            <span className="font-semibold text-[11px]">Conexão</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setGameCategory('diversao');
              setGamesModalOpen(true);
            }}
            className="flex-1 py-1.5 px-3 rounded-full bg-white/5 border border-white/10 hover:border-[#FFB700]/40 flex items-center justify-center gap-1.5 text-xs text-white/80 active:scale-95 transition-all"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#FFB700]" />
            <span className="font-semibold text-[11px]">Diversão</span>
          </button>
        </div>

        {/* Input de Mensagem e Gravação de Áudio */}
        {isRecording ? (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-red-950/40 border border-red-500/40 animate-pulse">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Gravando áudio... {recordTimer}s</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelRecording}
                className="px-3 py-1 rounded-xl bg-white/10 text-white/70 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleStopRecordingAndSend}
                className="p-2 rounded-full bg-red-600 text-white shadow-lg active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Botão de Microfone Nativo */}
            <button
              type="button"
              onClick={handleStartRecording}
              className={`p-2.5 rounded-full border transition-all active:scale-90 ${
                isLove
                  ? 'bg-white/5 border-white/15 text-[#FF55A3] hover:bg-[#FF007F]/20'
                  : 'bg-white/5 border-white/15 text-[#FFC933] hover:bg-[#FFB700]/20'
              }`}
              title="Gravar Áudio"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Input de Texto */}
            <input
              type="text"
              placeholder="Escreva uma mensagem carinhosa..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#1A1A2B] border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-[#FF007F]"
            />

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-full transition-all active:scale-90 disabled:opacity-30 ${
                isLove
                  ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_12px_rgba(255,0,127,0.5)]'
                  : 'bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black shadow-[0_0_12px_rgba(255,183,0,0.5)]'
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        )}
      </div>

      {/* MODAL 10: CLIMAS DE MG */}
      {climaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#151522] border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-[#FFB700]" />
              Climas e Ambiências de Minas Gerais
            </h3>
            <p className="text-[11px] text-white/60">
              Muda o plano de fundo e toca som relaxante em loop para os dois a 15% de volume:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => applyClima('por_do_sol')}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#FF007F]/20 to-[#FF8800]/20 border border-white/10 text-left hover:border-white/30"
              >
                <h4 className="text-xs font-bold text-white">🌅 Pôr do Sol na Serra</h4>
                <p className="text-[10px] text-white/70">
                  Luz de fim de tarde e som de brisa e pássaros da serra mineira.
                </p>
              </button>

              <button
                onClick={() => applyClima('ouro_preto')}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#FFB700]/20 to-[#6E481F]/20 border border-white/10 text-left hover:border-white/30"
              >
                <h4 className="text-xs font-bold text-white">🕯️ Noite em Tiradentes / Ouro Preto</h4>
                <p className="text-[10px] text-white/70">
                  Luzes acolhedoras de lampião e clima de centro histórico.
                </p>
              </button>

              <button
                onClick={() => applyClima('chuva_fazenda')}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#1E3A8A]/20 to-[#0F172A]/20 border border-white/10 text-left hover:border-white/30"
              >
                <h4 className="text-xs font-bold text-white">🌧️ Chuva na Fazenda</h4>
                <p className="text-[10px] text-white/70">
                  Fundo azul profundo e som suave de chuva no telhado de barro.
                </p>
              </button>

              <button
                onClick={() => applyClima('padrao')}
                className="p-2.5 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:text-white"
              >
                Voltar ao Clima Padrão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAIS COMPONENTIZADOS */}
      <YouTubeSyncModal
        isOpen={ytModalOpen}
        onClose={() => setYtModalOpen(false)}
        syncState={ytSyncState}
        onUpdateSync={setYtSyncState}
      />

      <ChatGamesModal
        isOpen={gamesModalOpen}
        onClose={() => setGamesModalOpen(false)}
        type={gameCategory}
        onSendGameMessage={(content, type) => {
          const gameMsg: ChatMessage = {
            id: `msg-game-${Date.now()}`,
            chat_id: 'chat-active',
            sender_id: 'me',
            type,
            content,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, gameMsg]);
        }}
      />
    </div>
  );
};
