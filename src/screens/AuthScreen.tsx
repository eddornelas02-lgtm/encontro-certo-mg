import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

type AuthTab = 'entrar' | 'criar';

export const AuthScreen: React.FC = () => {
  const { signUp, signIn, triggerHaptic } = useApp();

  const [tab, setTab] = useState<AuthTab>('criar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchTab = (next: AuthTab) => {
    triggerHaptic('light');
    setTab(next);
    setError(null);
    setNotice(null);
  };

  const validate = (): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Informe um e-mail válido.';
    }
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (tab === 'criar' && password !== confirm) {
      return 'As senhas não coincidem.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const validationError = validate();
    if (validationError) {
      triggerHaptic('warning');
      setError(validationError);
      return;
    }

    triggerHaptic('medium');
    setLoading(true);

    try {
      if (tab === 'criar') {
        const { error: signUpError, needsConfirmation } = await signUp(email, password);
        if (signUpError) {
          triggerHaptic('warning');
          setError(signUpError);
        } else if (needsConfirmation) {
          triggerHaptic('success');
          setNotice(
            'Conta criada! Enviamos um link de confirmação para o seu e-mail. Depois de confirmar, é só entrar.'
          );
          setTab('entrar');
        } else {
          triggerHaptic('success');
          setNotice('Tudo certo! Entrando no seu perfil de Minas Gerais...');
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          triggerHaptic('warning');
          setError(signInError);
        }
      }
    } catch (err: any) {
      triggerHaptic('warning');
      setError(err?.message || 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isCreate = tab === 'criar';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar select-none px-5 pb-8 pt-2">
      {/* Cabeçalho / Marca */}
      <div className="pt-4 pb-5 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-[#FF007F] to-[#FF2A85] flex items-center justify-center shadow-[0_0_35px_rgba(255,0,127,0.55)] mb-4">
          <Heart className="w-10 h-10 text-white fill-current" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Encontro Certo <span className="text-[#FF2A85]">MG</span>
        </h1>
        <p className="text-xs text-white/60 mt-1.5 max-w-xs leading-relaxed">
          Conexões sinceras e amizades acolhedoras por todo o estado de Minas Gerais.
        </p>
      </div>

      {/* Seletor Entrar / Criar Conta */}
      <div className="w-full bg-[#13131F] p-1.5 rounded-3xl border border-white/10 flex items-center shadow-lg mb-4">
        <button
          onClick={() => switchTab('criar')}
          className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 ${
            isCreate
              ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_16px_rgba(255,0,127,0.6)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Criar Conta</span>
        </button>

        <button
          onClick={() => switchTab('entrar')}
          className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 ${
            !isCreate
              ? 'bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white shadow-[0_0_16px_rgba(255,0,127,0.6)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Entrar</span>
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* E-mail */}
        <div>
          <label className="text-[11px] font-medium text-white/70 block mb-1.5">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            <input
              type="email"
              autoComplete="email"
              placeholder="seunome@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A2B] border border-white/15 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#FF007F] transition-colors"
            />
          </div>
        </div>

        {/* Senha */}
        <div>
          <label className="text-[11px] font-medium text-white/70 block mb-1.5">
            Senha
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isCreate ? 'new-password' : 'current-password'}
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A2B] border border-white/15 rounded-2xl pl-10 pr-11 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#FF007F] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-white/40 hover:text-white/80 p-0.5"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirmar Senha (apenas no cadastro) */}
        {isCreate && (
          <div>
            <label className="text-[11px] font-medium text-white/70 block mb-1.5">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-[#1A1A2B] border border-white/15 rounded-2xl pl-10 pr-3 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#FF007F] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Mensagens */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-[11px] text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{notice}</span>
          </div>
        )}

        {/* Botão Principal */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#FF2A85] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,0,127,0.55)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isCreate ? 'Criando sua conta...' : 'Entrando...'}</span>
            </>
          ) : (
            <>
              <span>{isCreate ? 'Criar minha conta' : 'Entrar no app'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Rodapé informativo */}
      <div className="mt-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] text-white/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Cadastro apenas com e-mail e senha, por enquanto. Seus dados são salvos de forma segura e
            sem bots.
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/45">
          <MapPin className="w-3 h-3 text-[#FF55A3]" />
          <span>
                      Perfis de demonstração já estão disponíveis para você explorar Minas Gerais
                    </span>
                  </div>
                </div>
              </div>
            );
          };