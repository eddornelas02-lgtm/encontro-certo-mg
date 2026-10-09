import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, CircleAlert, Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess('Conta criada com sucesso! Você já pode acessar o app.');
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d18] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <Link
          to="/"
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao app
        </Link>

        <section className="rounded-[2rem] border border-[#ff2a85]/25 bg-[#171725] p-6 shadow-[0_20px_70px_rgba(255,42,133,0.16)] sm:p-8">
          <div className="mb-7">
            <span className="rounded-full bg-[#ff2a85]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff72ad]">
              Teste Supabase Auth
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight">Criar conta de teste</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Cadastre um e-mail para validar o retorno do Supabase sem confirmação por e-mail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-white/75">E-mail</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/35" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-2xl border border-white/10 bg-[#10101b] px-10 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#ff2a85]"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-white/75">Senha</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/35" />
                <input
                  required
                  minLength={6}
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full rounded-2xl border border-white/10 bg-[#10101b] px-10 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#ff2a85]"
                />
              </span>
            </label>

            {error && (
              <div className="flex gap-2 rounded-2xl border border-red-400/25 bg-red-400/10 p-3 text-xs leading-relaxed text-red-200">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-xs leading-relaxed text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff2a85] px-4 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(255,42,133,0.25)] transition-colors hover:bg-[#ff4b98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Criando conta...' : 'Criar minha conta'}
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-white/45">
            O erro exibido abaixo do formulário é a mensagem original retornada pelo Supabase.
          </p>
        </section>
      </div>
    </main>
  );
};

export default AuthTest;
