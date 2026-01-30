import type { User } from '@supabase/supabase-js';

export const getMyProfile = (user: User) => {
  const userId = user.id;
  const userEmail = user.email;
  const { full_name, avatar_url } = user.user_metadata;

  return {
    id: userId,
    email: userEmail,
    name: full_name || 'Anonymous',
    avatar: avatar_url,
  };
};
