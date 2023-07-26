'use client';

import { FqlxProvider } from 'fauna-typed';

const FAUNA_ENDPOINT = 'https://db.fauna.com';

interface FqlxClientProviderProps {
  children: React.ReactNode;
}

export default function FqlxClientProvider({
  children,
}: FqlxClientProviderProps) {
  return (
    <FqlxProvider
      config={{
        fqlxSecret: 'fnAFDgD5f9AAzGOyo_Ag3S1q9RCx__j6EXTXDCCO',
        endpoint: new URL(FAUNA_ENDPOINT),
      }}
      loader={<div>Loading...</div>}
    >
      <>{children}</>
    </FqlxProvider>
  );
}
