import React, { PropsWithChildren } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@workspace/utils';

const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
