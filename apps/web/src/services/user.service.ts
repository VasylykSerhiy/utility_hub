import { API, api, apiAuth } from '@/lib/axios';
import { AuthInput } from '@workspace/utils';

export const userService = {
  getMe: async () => apiAuth.get(API.ME),
  postAuth: async ({ token }: AuthInput) => api.post(API.AUTH, { token }),
};
