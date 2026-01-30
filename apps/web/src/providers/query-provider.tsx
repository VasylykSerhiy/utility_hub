import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@workspace/utils';
import type { PropsWithChildren } from 'react';

const QueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
