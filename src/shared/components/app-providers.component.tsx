"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@shared/components/query-provider.component";

interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return <QueryProvider>{children}</QueryProvider>;
}

export { AppProviders };
export type { AppProvidersProps };
