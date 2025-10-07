import { API, apiAuth } from '@/lib/axios';
import { AuthInput } from '@workspace/utils';

export const userService = {
  getMe: async () => apiAuth.get(API.ME),
  postAuth: async ({ token }: AuthInput) => apiAuth.post(API.AUTH, { token }),
};
