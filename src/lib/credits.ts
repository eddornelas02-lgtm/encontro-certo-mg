import { supabase } from '@/lib/supabase';
import type { CreditTransaction, CreditWallet } from '@/types';

export interface CreditActionResult {
  balance: number;
  awarded?: number;
  credits?: number;
  cost?: number;
  vip_tier?: CreditWallet['vip_tier'];
  vip_until?: string;
}

export async function getCreditWallet(): Promise<CreditWallet> {
  const { data, error } = await supabase.rpc('get_credit_wallet');
  if (error) throw new Error(error.message);

  const wallet = (Array.isArray(data) ? data[0] : data) as CreditWallet | undefined;
  if (!wallet) throw new Error('Não foi possível carregar sua carteira.');
  return wallet;
}

export async function getCreditTransactions(): Promise<CreditTransaction[]> {
  const { data, error } = await supabase.rpc('get_credit_transactions');
  if (error) throw new Error(error.message);
  return (data ?? []) as CreditTransaction[];
}

export async function claimAdReward(): Promise<CreditActionResult> {
  const { data, error } = await supabase.rpc('claim_ad_reward');
  if (error) throw new Error(error.message);
  return data as CreditActionResult;
}

export async function simulateCreditPurchase(packageCode: string): Promise<CreditActionResult> {
  const { data, error } = await supabase.rpc('simulate_credit_purchase', {
    p_package_code: packageCode,
  });
  if (error) throw new Error(error.message);
  return data as CreditActionResult;
}

export async function activateVip(planCode: string): Promise<CreditActionResult> {
  const { data, error } = await supabase.rpc('activate_vip', {
    p_plan_code: planCode,
  });
  if (error) throw new Error(error.message);
  return data as CreditActionResult;
}
