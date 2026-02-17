"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        theme="system" // or light/dark based on user context if available, defaulting to system
      />
      {children}
    </QueryClientProvider>
  );
}
