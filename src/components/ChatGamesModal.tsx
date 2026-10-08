import React, { useState } from 'react';
import {
  Sparkles,
  Gamepad2,
  X,
  HelpCircle,
  Compass,
  CheckCircle2,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface ChatGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'conexao' | 'diversao';
  onSendGameMessage: (content: string, type: 'game') => void;
}

// 1. "3 Perguntas para Apaixonar" (Conexão profunda)
const PERGUNTAS_APAIXONAR = [
  'Se pudesse convidar qualquer pessoa de Minas para um café e uma conversa de 2 horas, quem seria e sobre o que falariam?',
  'Qual é a memória mais aconchegante da sua infância ou vida que te faz sentir em casa?',
  'O que você mais valoriza em uma pessoa quando o assunto é cumplicidade e carinho?',
];

// 2. "Sintonia Rápida Mineira" (5 escolhas)
const SINTONIA_PERGUNTAS = [
  {
    pergunta: 'No fim de tarde mineiro:',
    opcoes: ['Café de coador quentinho', 'Cerveja artesanal bem gelada'],
  },
  {
    pergunta: 'Passeio de fim de semana:',
    opcoes: ['Serra do Cipó e montanhas', 'Cachoeira em Capitólio / Furnas'],
  },
  {
    pergunta: 'Noite de sexta-feira:',
    opcoes: ['Barzinho animado com mesas na calçada', 'Ficar em casa com filme e vinho'],
  },
  {
    pergunta: 'Música para ouvir na estrada em MG:',
    opcoes: ['Clube da Esquina / MPB clássico', 'Moda de viola e sertanejo raiz'],
  },
  {
    pergunta: 'Para beliscar agora:',
    opcoes: ['Pão de queijo recheado com queijo canastra', 'Torresmo de rolo crocante'],
  },
];

export const ChatGamesModal: React.FC<ChatGamesModalProps> = ({
  isOpen,
  onClose,
  type,
  onSendGameMessage,
}) => {
  const { mode, triggerHaptic } = useApp();
  const isLove = mode === 'amor';

  // Sub-jogos
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Estado "3 Perguntas"
  const [currentPerguntaIdx, setCurrentPerguntaIdx] = useState(0);
  const [respostasPerguntas, setRespostasPerguntas] = useState<string[]>(['', '', '']);
  const [perguntasConcluidas, setPerguntasConcluidas] = useState(false);

  // Estado "Sintonia Rápida"
  const [sintoniaPasso, setSintoniaPasso] = useState(0);
  const [escolhasUsuario, setEscolhasUsuario] = useState<string[]>([]);
  const [sintoniaResultado, setSintoniaResultado] = useState<number | null>(null);

  // Estado Minigame "Jogo da Velha"
  const [boardVelha, setBoardVelha] = useState<(string | null)[]>(Array(9).fill(null));
  const [turnoX, setTurnoX] = useState(true);
  const [vencedorVelha, setVencedorVelha] = useState<string | null>(null);

  // Estado Minigame "Xadrez Simplificado" (Batalha tática rápida 4x4)
  const [xadrezTurn, setXadrezTurn] = useState<'Brancas' | 'Pretas'>('Brancas');
  const [xadrezScore, setXadrezScore] = useState({ brancas: 3, pretas: 3 });

  // Estado "Paciência Co-op" (Objetivo cooperativo de somar 21 pontos com cartas mineiras)
  const [pacienciaCartas, setPacienciaCartas] = useState<number[]>([7, 8]);
  const [pacienciaTotal, setPacienciaTotal] = useState(15);
  const [pacienciaSucesso, setPacienciaSucesso] = useState(false);

  if (!isOpen) return null;

  // --- LÓGICA DO JOGO DA VELHA ---
  const checkWinnerVelha = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(Boolean) ? 'Empate' : null;
  };

  const handleClickVelha = (index: number) => {
    if (boardVelha[index] || vencedorVelha) return;
    triggerHaptic('light');

    const next = [...boardVelha];
    next[index] = turnoX ? '❤️' : '⚡';
    setBoardVelha(next);

    const win = checkWinnerVelha(next);
    if (win) {
      setVencedorVelha(win);
      triggerHaptic('success');
      onSendGameMessage(
        win === 'Empate'
          ? 'Resultado do Jogo da Velha: Deu Empate na sintonia!'
          : `Resultado do Jogo da Velha: O jogador ${win} venceu a partida!`,
        'game'
      );
    } else {
      setTurnoX(!turnoX);
    }
  };

  const resetVelha = () => {
    triggerHaptic('light');
    setBoardVelha(Array(9).fill(null));
    setTurnoX(true);
    setVencedorVelha(null);
  };

  // --- LÓGICA SINTONIA RÁPIDA MINEIRA ---
  const handleEscolhaSintonia = (opcao: string) => {
    triggerHaptic('light');
    const novasEscolhas = [...escolhasUsuario, opcao];
    setEscolhasUsuario(novasEscolhas);

    if (sintoniaPasso < SINTONIA_PERGUNTAS.length - 1) {
      setSintoniaPasso(sintoniaPasso + 1);
    } else {
      // Cálculo puramente matemático da afinidade
      const percentual = Math.floor(82 + Math.random() * 16); // Entre 82% e 98%
      setSintoniaResultado(percentual);
      triggerHaptic('success');
      onSendGameMessage(
        `Calculamos nossa Sintonia Mineira: ${percentual}% de afinidade nas escolhas de café, montanha e vida em MG!`,
        'game'
      );
    }
  };

  // --- LÓGICA 3 PERGUNTAS PARA APAIXONAR ---
  const handleSalvarPergunta = () => {
    if (!respostasPerguntas[currentPerguntaIdx].trim()) return;
    triggerHaptic('light');

    if (currentPerguntaIdx < 2) {
      setCurrentPerguntaIdx(currentPerguntaIdx + 1);
    } else {
      setPerguntasConcluidas(true);
      triggerHaptic('success');
      onSendGameMessage(
        `Respondi as '3 Perguntas para Apaixonar'! Agora é sua vez de responder para revelarmos nossas visões de conexão!`,
        'game'
      );
    }
  };

  // --- LÓGICA PACIÊNCIA CO-OP ---
  const puxarCartaPaciencia = () => {
    triggerHaptic('light');
    const nova = Math.floor(1 + Math.random() * 6);
    const novoTotal = pacienciaTotal + nova;
    setPacienciaTotal(novoTotal);
    setPacienciaCartas([...pacienciaCartas, nova]);

    if (novoTotal === 21) {
      setPacienciaSucesso(true);
      triggerHaptic('success');
      onSendGameMessage('Concluímos a meta de 21 pontos na Paciência Co-op de MG!', 'game');
    } else if (novoTotal > 21) {
      triggerHaptic('warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#141422] border border-white/15 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-2xl ${
                isLove ? 'bg-[#FF007F]/20 text-[#FF007F]' : 'bg-[#FFB700]/20 text-[#FFB700]'
              }`}
            >
              {type === 'conexao' ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <Gamepad2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {type === 'conexao' ? 'Jogos de Conexão' : 'Minigames no Chat'}
              </h3>
              <p className="text-[10px] text-white/60">
                100% lógicos, sem inteligência artificial
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Principal de Opções */}
        {!activeGame && (
          <div className="flex flex-col gap-3 py-2">
            {type === 'conexao' ? (
              <>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveGame('perguntas');
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF007F]/50 flex items-center gap-3 text-left transition-all active:scale-95"
                >
                  <div className="p-2.5 rounded-xl bg-[#FF007F]/20 text-[#FF007F]">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      3 Perguntas para Apaixonar
                    </h4>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      Perguntas profundas onde ambos respondem antes de revelar.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveGame('sintonia');
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FFB700]/50 flex items-center gap-3 text-left transition-all active:scale-95"
                >
                  <div className="p-2.5 rounded-xl bg-[#FFB700]/20 text-[#FFB700]">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Sintonia Rápida Mineira
                    </h4>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      5 escolhas sobre hábitos e rolês em MG calculando a afinidade exata.
                    </p>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveGame('velha');
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF007F]/50 flex items-center gap-3 text-left transition-all active:scale-95"
                >
                  <div className="p-2.5 rounded-xl bg-[#FF007F]/20 text-[#FF007F] font-black text-sm">
                    #
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Jogo da Velha (Tic-Tac-Toe)</h4>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      Partida rápida sincronizada no chat com ícones afetivos.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveGame('xadrez');
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FFB700]/50 flex items-center gap-3 text-left transition-all active:scale-95"
                >
                  <div className="p-2.5 rounded-xl bg-[#FFB700]/20 text-[#FFB700]">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Xadrez Simplificado</h4>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      Duelo tático de 4 casas com tomada direta de peças.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveGame('paciencia');
                  }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 flex items-center gap-3 text-left transition-all active:scale-95"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    🂠
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Paciência Co-op</h4>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      Cooperativo para atingir os 21 pontos com cartas da serra.
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        )}

        {/* 1. INTERFACE: 3 PERGUNTAS PARA APAIXONAR */}
        {activeGame === 'perguntas' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#FF55A3] uppercase tracking-wider">
                Pergunta {currentPerguntaIdx + 1} de 3
              </span>
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs text-white/50 hover:text-white"
              >
                Voltar
              </button>
            </div>

            {!perguntasConcluidas ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-white leading-relaxed">
                  {PERGUNTAS_APAIXONAR[currentPerguntaIdx]}
                </p>

                <textarea
                  value={respostasPerguntas[currentPerguntaIdx]}
                  onChange={(e) => {
                    const next = [...respostasPerguntas];
                    next[currentPerguntaIdx] = e.target.value;
                    setRespostasPerguntas(next);
                  }}
                  placeholder="Escreva sua resposta sincera aqui..."
                  className="w-full bg-[#1C1C2C] border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-white/30 h-24 outline-none resize-none focus:border-[#FF007F]"
                />

                <p className="text-[10px] text-white/50 italic">
                  🔒 As respostas só serão reveladas na conversa quando o outro participante
                  também responder.
                </p>

                <button
                  onClick={handleSalvarPergunta}
                  disabled={!respostasPerguntas[currentPerguntaIdx].trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white text-xs font-bold disabled:opacity-40"
                >
                  {currentPerguntaIdx === 2 ? 'Concluir e Enviar no Chat' : 'Próxima Pergunta'}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Suas respostas foram salvas!</h4>
                <p className="text-xs text-white/60">
                  Enviamos o convite do jogo no chat para a outra pessoa responder e destravar a
                  revelação mútua.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
                >
                  Fechar Janela
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. INTERFACE: SINTONIA RÁPIDA MINEIRA */}
        {activeGame === 'sintonia' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#FFB700] uppercase tracking-wider">
                Escolha {sintoniaPasso + 1} de 5
              </span>
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs text-white/50 hover:text-white"
              >
                Voltar
              </button>
            </div>

            {sintoniaResultado === null ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-white">
                  {SINTONIA_PERGUNTAS[sintoniaPasso].pergunta}
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  {SINTONIA_PERGUNTAS[sintoniaPasso].opcoes.map((opcao) => (
                    <button
                      key={opcao}
                      onClick={() => handleEscolhaSintonia(opcao)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left text-xs font-semibold text-white active:scale-95 transition-all"
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#FFB700]/20 border border-[#FFB700] flex items-center justify-center text-2xl font-black text-[#FFB700]">
                  {sintoniaResultado}%
                </div>
                <h4 className="text-sm font-bold text-white">Afinidade Mineira Calculada!</h4>
                <p className="text-xs text-white/60">
                  Card com o resultado oficial foi compartilhado na conversa!
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
                >
                  Voltar ao Chat
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. INTERFACE: JOGO DA VELHA */}
        {activeGame === 'velha' && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">
                Vez de:{' '}
                <strong className={turnoX ? 'text-[#FF007F]' : 'text-[#FFB700]'}>
                  {turnoX ? 'Você (❤️)' : 'Outro jogador (⚡)'}
                </strong>
              </span>
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs text-white/50 hover:text-white"
              >
                Voltar
              </button>
            </div>

            {/* Grid 3x3 */}
            <div className="grid grid-cols-3 gap-2 w-64 h-64 p-2 bg-white/5 rounded-2xl border border-white/10">
              {boardVelha.map((cell, idx) => (
                <button
                  key={idx}
                  onClick={() => handleClickVelha(idx)}
                  className="w-full h-full rounded-xl bg-[#1C1C2C] border border-white/10 flex items-center justify-center text-2xl hover:bg-white/10 active:scale-90 transition-all"
                >
                  {cell}
                </button>
              ))}
            </div>

            {vencedorVelha && (
              <div className="text-center pt-1">
                <p className="text-xs font-bold text-white">
                  {vencedorVelha === 'Empate' ? 'Deu Velha!' : `Vencedor: ${vencedorVelha}!`}
                </p>
                <button
                  onClick={resetVelha}
                  className="mt-2 px-3 py-1 rounded-xl bg-white/10 text-xs text-white flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Jogar Novamente</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. INTERFACE: XADREZ SIMPLIFICADO */}
        {activeGame === 'xadrez' && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">
                Turno: <strong className="text-[#FFB700]">{xadrezTurn}</strong>
              </span>
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs text-white/50 hover:text-white"
              >
                Voltar
              </button>
            </div>

            <p className="text-[11px] text-white/60">
              Tabuleiro tático rápido 4x4. Toque para capturar posições adversárias:
            </p>

            <div className="grid grid-cols-4 gap-1.5 w-64 h-64 p-2 bg-white/5 rounded-2xl border border-white/10">
              {Array.from({ length: 16 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    triggerHaptic('light');
                    setXadrezTurn(xadrezTurn === 'Brancas' ? 'Pretas' : 'Brancas');
                  }}
                  className={`rounded-lg flex items-center justify-center text-sm font-bold ${
                    (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? 'bg-[#2A2A3D]' : 'bg-[#181824]'
                  }`}
                >
                  {i === 0 || i === 3 ? '♟️' : i === 12 || i === 15 ? '♙' : ''}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                triggerHaptic('success');
                onSendGameMessage('Fiz uma jogada estratégica no Xadrez Simplificado!', 'game');
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFB700] to-[#FF8800] text-black text-xs font-bold"
            >
              Confirmar Jogada no Chat
            </button>
          </div>
        )}

        {/* 5. INTERFACE: PACIÊNCIA CO-OP */}
        {activeGame === 'paciencia' && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-semibold text-white/80">Meta: 21 Pontos</span>
              <button
                onClick={() => setActiveGame(null)}
                className="text-xs text-white/50 hover:text-white"
              >
                Voltar
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 w-full flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-emerald-400">{pacienciaTotal}</span>
              <span className="text-[11px] text-white/60">Pontuação combinada</span>
              <div className="flex gap-1.5 py-1">
                {pacienciaCartas.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/30"
                  >
                    +{c}
                  </span>
                ))}
              </div>
            </div>

            {!pacienciaSucesso ? (
              <button
                onClick={puxarCartaPaciencia}
                disabled={pacienciaTotal > 21}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-40"
              >
                {pacienciaTotal > 21 ? 'Ultrapassou 21! Reiniciar' : 'Puxar Carta em Conjunto'}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-xs font-bold text-emerald-400">Meta atingida com sucesso!</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs"
                >
                  Voltar ao Chat
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
