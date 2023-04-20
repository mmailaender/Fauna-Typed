'use client';

import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { create } from 'zustand';

export interface FqlxStore {
  fqlxSecret: string;
  setFqlxSecret(secret: string): void;
}

export const useFqlxStore = create<FqlxStore>(set => ({
  fqlxSecret: '',
  setFqlxSecret: (secret: string) => set(() => ({ fqlxSecret: secret })),
}));

export const FqlxProvider = ({
  config,
  children,
}: {
  config: { fqlxSecret: string };
  children: React.ReactElement;
}): JSX.Element => {
  const { setFqlxSecret, fqlxSecret } = useFqlxStore(
    (state: FqlxStore) => state
  );
  console.log('config===========', config.fqlxSecret);

  useEffect(() => {
    console.log('updating secret===========', config.fqlxSecret);
    if (!config.fqlxSecret) {
      throw new Error('Missing Fauna Secret');
    }

    setFqlxSecret(config.fqlxSecret);
  }, [config.fqlxSecret]);

  if (!fqlxSecret) {
    return <div>Loading...</div>;
  }

  return useMemo(() => children, [config]);
};
