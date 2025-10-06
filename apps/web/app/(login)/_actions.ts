'use server';

import { createServerClient } from '@/lib/supabase/client';
import { UserAuthShema } from '@workspace/utils';

export const singInAction = async ({ email, password }: UserAuthShema) => {
  const supabase = await createServerClient();
  return await supabase.auth.signInWithPassword({ email, password });
};

export const singUpAction = async ({ email, password }: UserAuthShema) => {
  const supabase = await createServerClient();
  return await supabase.auth.signUp({ email, password });
};

export const resendVerificationEmailAction = async (email: string) => {
  const supabase = await createServerClient();
  return await supabase.auth.resend({
    type: 'signup',
    email,
  });
};

export const singOutAction = async () => {
  const supabase = await createServerClient();
  return await supabase.auth.signOut();
};
