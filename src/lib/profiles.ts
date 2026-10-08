import { supabase } from '@/lib/supabase';
import { Mode, UserProfile, getCityCode, getCityRegion } from '@/types';
import type { User } from '@supabase/supabase-js';

// Data de nascimento padrão (apenas e-mail e senha são pedidos por enquanto).
// Mantida com mais de 18 anos para satisfazer a regra de idade do banco.
const DEFAULT_BIRTH_DATE = '1998-05-15';

interface AccountRow {
  display_name: string;
  birth_date: string;
}

interface ProfileRow {
  id: string;
  user_id: string;
  city: string;
  city_code: number;
  region: string;
  mode: Mode;
  bio: string;
  photos: string[];
  updated_at: string;
}

/** Gera um display_name válido (2 a 60 caracteres) a partir do e-mail. */
export function deriveDisplayName(email: string): string {
  const raw = (email.split('@')[0] || 'mineiro').replace(/[^A-Za-z0-9._-]/g, '');
  let name = raw.length > 0 ? raw : 'mineiro';
  if (name.length < 2) name = `${name}mg`;
  return name.slice(0, 60);
}

/** Calcula a idade a partir da data de nascimento. */
export function computeAge(birthDate: string): number {
  const bd = new Date(birthDate);
  if (Number.isNaN(bd.getTime())) return 26;
  const diff = Date.now() - bd.getTime();
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  return age > 0 && age < 120 ? age : 26;
}

function toUserProfile(row: ProfileRow, account: AccountRow): UserProfile {
  return {
    id: row.id,
    user_id: row.user_id,
    name: account.display_name,
    age: computeAge(account.birth_date),
    city: row.city,
    city_code: row.city_code,
    region: row.region,
    mode: row.mode,
    bio: row.bio ?? '',
    photos: row.photos ?? [],
    interests: [],
    updated_at: row.updated_at,
  };
}

/** Garante que a conta do usuário autenticado exista na tabela `accounts`. */
export async function ensureAccount(user: User): Promise<AccountRow> {
  const { data: existing } = await supabase
    .from('accounts')
    .select('display_name, birth_date')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) return existing as AccountRow;

  const display_name = deriveDisplayName(user.email ?? '');
  const payload = { user_id: user.id, display_name, birth_date: DEFAULT_BIRTH_DATE };
  const { error } = await supabase.from('accounts').insert(payload);

  // 23505 = chave duplicada (a conta já existia em outra aba/dispositivo)
  if (error && error.code !== '23505') {
    throw new Error(error.message);
  }

  return { display_name, birth_date: DEFAULT_BIRTH_DATE };
}

/** Garante que o perfil (por modo) do usuário exista em `user_profiles`. */
export async function ensureProfileRow(
  userId: string,
  mode: Mode,
  city = 'Belo Horizonte'
): Promise<ProfileRow> {
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('mode', mode)
    .maybeSingle();

  if (existing) return existing as ProfileRow;

  const payload = {
    user_id: userId,
    city,
    city_code: getCityCode(city),
    region: getCityRegion(city),
    mode,
    bio: '',
    photos: [],
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as ProfileRow;
}

/**
 * Carrega (ou cria) os perfis reais de Amor e Amizade do usuário autenticado.
 * Somente usuários reais entram aqui — perfis falsos nunca são salvos.
 */
export async function loadOrCreateMyProfiles(
  user: User
): Promise<{ love: UserProfile; friend: UserProfile }> {
  const account = await ensureAccount(user);
  const loveRow = await ensureProfileRow(user.id, 'amor');
  const friendRow = await ensureProfileRow(user.id, 'amizade');
  return {
    love: toUserProfile(loveRow, account),
    friend: toUserProfile(friendRow, account),
  };
}

/** Persiste as alterações de um perfil real no banco. */
export async function saveProfile(userId: string, profile: UserProfile): Promise<void> {
  const { error } = await supabase.from('user_profiles').upsert(
    {
      user_id: userId,
      city: profile.city,
      city_code: getCityCode(profile.city),
      region: getCityRegion(profile.city),
      mode: profile.mode,
      bio: (profile.bio ?? '').slice(0, 500),
      photos: (profile.photos ?? []).slice(0, 6),
    },
    { onConflict: 'user_id,mode' }
  );

  if (error) throw new Error(error.message);
}

/** Traduz mensagens de erro do Supabase Auth para o português. */
export function translateAuthError(message: string): string {
  const msg = (message || '').toLowerCase();

  if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('user already registered') || msg.includes('already been registered'))
    return 'Este e-mail já está cadastrado. Tente entrar.';
  if (msg.includes('password should be at least'))
    return 'A senha deve ter pelo menos 6 caracteres.';
  if (msg.includes('email not confirmed'))
    return 'Confirme seu e-mail para entrar.';
  if (msg.includes('unable to validate email') || msg.includes('invalid email'))
    return 'Informe um e-mail válido.';
  if (msg.includes('rate limit') || msg.includes('for security purposes'))
    return 'Muitas tentativas. Aguarde um instante e tente novamente.';

  return message || 'Algo deu errado. Tente novamente.';
}