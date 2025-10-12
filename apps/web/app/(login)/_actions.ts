'use server';

import { createClient } from '@/lib/supabase/server';
import { UserAuthShema } from '@workspace/utils';

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
