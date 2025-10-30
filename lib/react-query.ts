import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,

      gcTime: 1000 * 60 * 10,

      refetchOnMount: false,

      refetchOnWindowFocus: false,

      retry: 1,

      placeholderData: (previousData) => previousData as any,
    },
  },
})
