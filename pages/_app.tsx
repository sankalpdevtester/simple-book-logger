import type { AppProps } from 'next/app';
import { TRPCProvider } from '@trpc/react';
import { createTRPCClient } from '../utils/trpc';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TRPCProvider client={createTRPCClient}>
      <Component {...pageProps} />
    </TRPCProvider>
  );
}

export default MyApp;