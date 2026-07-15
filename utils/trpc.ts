import { createTRPCClient } from '@trpc/client';
import { httpLink } from '@trpc/client/links/httpLink';

export const createTRPCClient = () =>
  createTRPCClient({
    links: [
      httpLink({
        url: '/api/trpc',
      }),
    ],
  });

export const trpc = createTRPCClient();