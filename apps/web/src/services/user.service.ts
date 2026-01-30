import type { IUser } from '@workspace/types';
import type { AuthInput } from '@workspace/utils';

import { API, api, apiAuth } from '@/lib/axios';

export const userService = {
  getMe: async () => apiAuth.get<IUser>(API.ME),
  postAuth: async ({ token }: AuthInput) => api.post(API.AUTH, { token }),
};
