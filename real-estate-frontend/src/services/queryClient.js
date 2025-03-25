import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      suspense: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Predefined query keys for better organization
export const queryKeys = {
  properties: {
    all: ['properties'],
    detail: (id) => ['properties', id],
    featured: ['properties', 'featured'],
    search: (params) => ['properties', 'search', params],
  },
  reservations: {
    all: ['reservations'],
    detail: (id) => ['reservations', id],
    user: (userId) => ['reservations', 'user', userId],
  },
  user: {
    profile: ['user', 'profile'],
    payments: (userId) => ['user', 'payments', userId],
  },
  payments: {
    receipt: (id) => ['payments', 'receipt', id],
  },
}; 