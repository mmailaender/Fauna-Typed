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
        fqlxSecret: '',
        endpoint: new URL(FAUNA_ENDPOINT),
      }}
      loader={<div>Loading...</div>}
    >
      <>{children}</>
    </FqlxProvider>
  );
}
