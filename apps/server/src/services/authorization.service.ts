import { createClient } from '@supabase/supabase-js';
import { AuthInput } from '@workspace/utils';

import { User } from '../models/database';

const auth = async ({ token }: AuthInput) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) throw new Error('Invalid token');

  let user = await User.findOne({ supabaseId: data.user.id });

  if (!user) {
    user = await User.create({
      supabaseId: data.user.id,
      email: data.user.email,
      fullName: data.user.user_metadata.full_name || 'New User',
      createdAt: new Date(),
    });
  }

  return user;
};

export default { auth };
