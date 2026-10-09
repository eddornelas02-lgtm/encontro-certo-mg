import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Crown,
  Gift,
  History,
  Loader2,
  PlayCircle,
  ShieldCheck,
  ShoppingBag,
  WalletCards,
  Zap,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import {
  activateVip,
  claimAdReward,
  getCreditTransactions,
  getCreditWallet,
  simulateCreditPurchase,
} from '@/lib/credits';
import { CREDIT_PACKAGES, VIP_PLANS } from '@/types';
import type { CreditTransaction, CreditWallet } from '@/types';

const REWARD_SECONDS = 20;

type Action = 'loading' | 'reward' | 'purchase' | 'vip' | null;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value));

export const WalletScreen: React.FC = () => {
  const { triggerHaptic } = useApp();
  const [wallet, setWallet] = useState<CreditWallet | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [action, setAction] = useState<Action>('loading');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [rewardSeconds, setRewardSeconds] = useState(0);
  const [rewardReady, setRewardReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = async () => {
    const [nextWallet, nextTransactions] = await Promise.all([
      getCreditWallet(),
      getCreditTransactions(),
    ]);
    setWallet(nextWallet);
    setTransactions(nextTransactions);
  };

  useEffect(() => {
    loadWallet()
      .catch((caughtError: unknown) => {
        setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível carregar sua carteira.');
      })
      .finally(() => setAction(null));
  }, []);

  useEffect(() => {
    if (rewardSeconds === 0 || rewardReady) return;

    const timer = window.setInterval(() => {
      setRewardSeconds((current) => {
        if (current <= 1) {
          setRewardReady(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [rewardSeconds, rewardReady]);

  const isVip = Boolean(wallet?.vip_until && new Date(wallet.vip_until).getTime() > Date.now());
  const vipName = isVip && wallet ? `VIP ${wallet.vip_tier}` : 'Plano gratuito';
  const vipUntil = isVip && wallet?.vip_until ? formatDate(wallet.vip_until) : null;
  const progress = Math.round(((REWARD_SECONDS - rewardSeconds) / REWARD_SECONDS) * 100);

  const handleStartReward = () => {
    setError(null);
    setMessage(null);
    setRewardReady(false);
    setRewardSeconds(REWARD_SECONDS);
    triggerHaptic('light');
  };

  const handleClaimReward = async () => {
    setAction('reward');
    setError(null);
    setMessage(null);

    try {
      const result = await claimAdReward();
      setMessage(`+${result.awarded ?? 15} créditos adicionados à sua carteira.`);
      setRewardReady(false);
      setRewardSeconds(0);
      await loadWallet();
      triggerHaptic('success');
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível resgatar a recompensa.');
      triggerHaptic('warning');
    } finally {
      setAction(null);
    }
  };

  const handlePurchase = async (packageCode: string) => {
    setSelectedPackage(packageCode);
    setAction('purchase');
    setError(null);
    setMessage(null);

    try {
      const result = await simulateCreditPurchase(packageCode);
      setMessage(`Compra simulada concluída: +${result.credits} créditos.`);
      await loadWallet();
      triggerHaptic('success');
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível simular a compra.');
      triggerHaptic('warning');
    } finally {
      setSelectedPackage(null);
      setAction(null);
    }
  };

  const handleActivateVip = async (planCode: string) => {
    setSelectedPlan(planCode);
    setAction('vip');
    setError(null);
    setMessage(null);

    try {
      const result = await activateVip(planCode);
      setMessage(`VIP ativado até ${result.vip_until ? formatDate(result.vip_until) : 'a data informada'}.`);
      await loadWallet();
      triggerHaptic('success');
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'Não foi possível ativar o VIP.');
      triggerHaptic('warning');
    } finally {
      setSelectedPlan(null);
      setAction(null);
    }
  };

  const sortedTransactions = useMemo(() => transactions.slice(0, 8), [transactions]);

  if (!wallet) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-white/70">
        {action === 'loading' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <p className="text-xs">{error ?? 'Não foi possível carregar sua carteira.'}</p>
            <button
              type="button"
              onClick={() => {
                setAction('loading');
                setError(null);
                loadWallet()
                  .catch((caughtError: unknown) => {
                    setError(caughtError instanceof Error ? caughtError.message : 'Tente novamente.');
                  })
                  .finally(() => setAction(null));
              }}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white"
            >
              Tentar novamente
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-28 pt-2 no-scrollbar">
      <header className="flex items-center justify-between py-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF72AD]">Central de vantagens</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white">Carteira & Recompensas</h1>
        </div>
        <div className="rounded-2xl bg-[#FF007F]/15 p-3 text-[#FF55A3]">
          <WalletCards className="h-6 w-6" />
        </div>
      </header>

      <section className="mt-3 rounded-3xl border border-[#FF007F]/30 bg-[#1a0d1b] p-5 shadow-[0_12px_35px_rgba(255,0,127,0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/60">Saldo disponível</p>
            <p className="mt-1 text-4xl font-black text-white">
              {wallet.balance.toLocaleString('pt-BR')}
              <span className="ml-2 text-sm font-bold text-[#FF72AD]">créditos</span>
            </p>
          </div>
          <div className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${isVip ? 'bg-amber-300 text-amber-950' : 'bg-white/10 text-white/60'}`}>
            <Crown className="mr-1 inline h-3.5 w-3.5" />
            {vipName}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/55">
          <span>Ganhos: {wallet.lifetime_earned.toLocaleString('pt-BR')}</span>
          <span>Gastos: {wallet.lifetime_spent.toLocaleString('pt-BR')}</span>
          {vipUntil && <span>Até {vipUntil}</span>}
        </div>
      </section>

      {message && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-2xl border border-red-400/25 bg-red-400/10 p-3 text-xs leading-relaxed text-red-200">
          {error}
        </div>
      )}

      <section className="mt-4 rounded-3xl border border-white/10 bg-[#141422] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#FFB700]" />
              <h2 className="text-sm font-bold text-white">Ganhe créditos</h2>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-white/55">
              Complete uma missão patrocinada demonstrativa de 20 segundos. O resgate é limitado a uma vez a cada 10 minutos.
            </p>
          </div>
          <span className="rounded-full bg-[#FFB700]/15 px-2.5 py-1 text-[10px] font-bold text-[#FFD66B]">+15</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e18]">
          <div className="flex items-center gap-3 p-3">
            <div className="rounded-xl bg-[#FFB700]/15 p-2.5 text-[#FFD66B]">
              <PlayCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white">Vídeo patrocinado (simulação)</p>
              <p className="text-[10px] text-white/45">Não é necessário clicar no anúncio.</p>
            </div>
            <Clock3 className="h-4 w-4 text-white/35" />
          </div>
          {rewardSeconds > 0 && (
            <div className="h-1 bg-white/10">
              <div className="h-full bg-[#FFB700] transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {!rewardReady ? (
          <button
            type="button"
            onClick={handleStartReward}
            disabled={rewardSeconds > 0 || action === 'reward'}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFB700] px-4 py-3 text-xs font-black text-[#221400] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rewardSeconds > 0 ? `Assistindo... ${rewardSeconds}s` : 'Começar missão de 20s'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClaimReward}
            disabled={action === 'reward'}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-xs font-black text-emerald-950 transition-opacity disabled:opacity-60"
          >
            {action === 'reward' && <Loader2 className="h-4 w-4 animate-spin" />}
            Resgatar 15 créditos
          </button>
        )}
        <p className="mt-2 text-center text-[9px] text-white/35">A recompensa é uma simulação de produto e não está vinculada a cliques no Google AdSense.</p>
      </section>

      <section className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#FF55A3]" />
              <h2 className="text-sm font-bold text-white">Comprar créditos</h2>
            </div>
            <p className="mt-1 text-[10px] text-white/45">Simulação de compra, sem cobrança real.</p>
          </div>
          <Zap className="h-4 w-4 text-[#FFB700]" />
        </div>
        <div className="grid gap-2.5">
          {CREDIT_PACKAGES.map((creditPackage) => (
            <div key={creditPackage.code} className={`flex items-center gap-3 rounded-2xl border p-3 ${creditPackage.featured ? 'border-[#FF2A85]/50 bg-[#FF007F]/10' : 'border-white/10 bg-[#141422]'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">{creditPackage.name}</p>
                  {creditPackage.featured && <span className="rounded-full bg-[#FF2A85] px-2 py-0.5 text-[8px] font-black uppercase text-white">Popular</span>}
                </div>
                <p className="mt-1 text-[11px] text-[#FFB7D2]">{creditPackage.credits.toLocaleString('pt-BR')} créditos · {creditPackage.price}</p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchase(creditPackage.code)}
                disabled={action === 'purchase'}
                className="rounded-xl bg-white/10 px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
              >
                {selectedPackage === creditPackage.code ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Simular'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <Crown className="h-4 w-4 text-[#FFD66B]" />
          <h2 className="text-sm font-bold text-white">Desbloqueie o VIP</h2>
        </div>
        <div className="space-y-2.5">
          {VIP_PLANS.map((plan) => (
            <div key={plan.code} className={`rounded-2xl border p-3 ${plan.featured ? 'border-[#FFD66B]/45 bg-[#2a210d]' : 'border-white/10 bg-[#141422]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">{plan.name}</p>
                  <p className="mt-1 text-[10px] text-white/50">{plan.duration} · {plan.cost} créditos</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleActivateVip(plan.code)}
                  disabled={action === 'vip'}
                  className="rounded-xl bg-[#FFD66B] px-3 py-2 text-[10px] font-black text-[#2b2000] transition-opacity disabled:opacity-50"
                >
                  {selectedPlan === plan.code ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Ativar'}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {plan.benefits.map((benefit) => (
                  <span key={benefit} className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-white/65">{benefit}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-[10px] leading-relaxed text-white/50">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>Os planos são cobrados somente em créditos. As compras exibidas nesta versão são simuladas e não processam dinheiro.</span>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <History className="h-4 w-4 text-white/70" />
          <h2 className="text-sm font-bold text-white">Últimas movimentações</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141422]">
          {sortedTransactions.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-white/45">Sua primeira recompensa ou compra aparecerá aqui.</p>
          ) : (
            sortedTransactions.map((transaction) => {
              const positive = transaction.amount > 0;
              return (
                <div key={transaction.id} className="flex items-center gap-3 border-b border-white/5 px-3 py-3 last:border-0">
                  <div className={`rounded-xl p-2 ${positive ? 'bg-emerald-400/10 text-emerald-300' : 'bg-[#FF2A85]/10 text-[#FF72AD]'}`}>
                    {positive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-white">{transaction.description}</p>
                    <p className="text-[9px] text-white/40">{formatDate(transaction.created_at)}</p>
                  </div>
                  <span className={`text-xs font-black ${positive ? 'text-emerald-300' : 'text-[#FF72AD]'}`}>
                    {positive ? '+' : ''}{transaction.amount}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default WalletScreen;
