"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useMemo } from "react";

const STALE_TIME = 5 * 60 * 1000;
const RETRY_COUNT = 2;

interface QueryProviderProps {
  children: ReactNode;
}

function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME,
            retry: RETRY_COUNT,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { QueryProvider };
export type { QueryProviderProps };
