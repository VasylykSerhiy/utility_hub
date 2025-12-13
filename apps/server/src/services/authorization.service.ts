import type { AuthInput } from '@workspace/utils/schemas/types';

import { supabase } from '../configs/supabase';
import { getMyProfile } from '../utils/getProfile';

const auth = async ({ token }: AuthInput) => {
  // 1. Перевіряємо токен через Supabase
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new Error('Invalid or expired token');
  }

  // 2. Повертаємо дані користувача напряму з Supabase Auth
  const user = data.user;

  // 3. Мапимо в чисту структуру для фронтенду (Опціонально, але рекомендовано)
  // Це дозволить фронтенду не змінювати логіку доступу до полів (наприклад, user.email)
  return getMyProfile(user);
};

export default { auth };
