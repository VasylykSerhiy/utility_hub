'use server';

import { createClient } from '@/lib/supabase/server';
import { UserAuthShema } from '@workspace/utils';

export const singInAction = async ({ email, password }: UserAuthShema) => {
  const supabase = await createClient();
  return await supabase.auth.signInWithPassword({ email, password });
};

export const singUpAction = async ({ email, password }: UserAuthShema) => {
  const supabase = await createClient();
  return await supabase.auth.signUp({ email, password });
};

export const resendVerificationEmailAction = async (email: string) => {
  const supabase = await createClient();
  return await supabase.auth.resend({
    type: 'signup',
    email,
  });
};

export const singOutAction = async () => {
  const supabase = await createClient();
  return await supabase.auth.signOut();
};

export const getAccessToken = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  return data.session?.access_token;
};

export const getSupabaseSession = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  return data;
};
