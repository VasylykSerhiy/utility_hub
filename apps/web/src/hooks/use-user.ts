import { useMutation, useQuery } from '@tanstack/react-query';
import type { AuthInput } from '@workspace/utils';
import { mutationKey, queryKeys } from '@/constants/query-key';
import { userService } from '@/services/user.service';

export const useAuthUser = () => {
  return useMutation({
    mutationKey: [mutationKey.auth],
    mutationFn: (token: AuthInput) => userService.postAuth(token),
  });
};

export const getMyInfo = () => {
  return useQuery({
    queryKey: [queryKeys.user],
    queryFn: userService.getMe,
    select: ({ data }) => data,
  });
};
