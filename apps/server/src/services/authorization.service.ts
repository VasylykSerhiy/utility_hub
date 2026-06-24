import type { AuthInput } from '@workspace/utils/schemas/types';

import { supabase } from '../configs/supabase';
import { getMyProfile } from '../utils/getProfile';
import { assertFound, unauthorized } from '../utils/http-errors';

const auth = async ({ token }: AuthInput) => {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    unauthorized('Invalid or expired token');
  }

  assertFound(data.user, 'Invalid or expired token');
  return getMyProfile(data.user);
};

export default { auth };
