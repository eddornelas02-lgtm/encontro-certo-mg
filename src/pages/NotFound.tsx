import { ArrowLeft, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-[#07070B] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#11111A] p-8 text-center shadow-2xl">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FF007F]/15 text-[#FF55A3]">
          <Compass className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF72AD]">Página não encontrada</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">404</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Esse caminho não existe, mas você pode voltar para o aconchego do app.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF007F] to-[#FF2A85] px-5 py-3 text-xs font-bold text-white shadow-[0_0_18px_rgba(255,0,127,0.35)] transition-transform hover:scale-[1.02] active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao app
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
