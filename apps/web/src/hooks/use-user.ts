import { mutationKey, queryKeys } from '@/constants/query-key';
import { userService } from '@/services/user.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthInput } from '@workspace/utils';

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
