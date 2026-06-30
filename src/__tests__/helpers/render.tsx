import React from 'react';
import { render, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

function Wrapper({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * Render a component inside a fresh QueryClientProvider.
 * Returns the queryClient so tests can inspect / prime the cache.
 */
export function renderWithQuery(
  ui: React.ReactElement,
  queryClient?: QueryClient,
) {
  const client = queryClient ?? createQueryClient();
  const result = render(
    <Wrapper queryClient={client}>{ui}</Wrapper>,
  );
  return { ...result, queryClient: client };
}

/**
 * renderHook inside a fresh QueryClientProvider.
 */
export function renderHookWithQuery<T>(
  hook: () => T,
  queryClient?: QueryClient,
) {
  const client = queryClient ?? createQueryClient();
  const result = renderHook(hook, {
    wrapper: ({ children }) => (
      <Wrapper queryClient={client}>{children}</Wrapper>
    ),
  });
  return { ...result, queryClient: client };
}
