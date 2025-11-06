"use client"

import React, { Suspense, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/hooks/use-auth"

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  // Create QueryClient on the client to avoid passing class instances from server -> client
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default RootLayoutClient
