import { API, api, apiAuth } from '@/lib/axios';
import { IUser } from '@workspace/types';
import { AuthInput } from '@workspace/utils';

export const userService = {
  getMe: async () => apiAuth.get<IUser>(API.ME),
  postAuth: async ({ token }: AuthInput) => api.post(API.AUTH, { token }),
};
