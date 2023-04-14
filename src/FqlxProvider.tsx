import React from 'react';
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
  children: React.ReactNode;
}): JSX.Element => {
  const { setFqlxSecret } = useFqlxStore((state: FqlxStore) => state);
  console.log('config===========', config.fqlxSecret);

  useEffect(() => {
    console.log('updating secret===========', config.fqlxSecret);
    setFqlxSecret(config.fqlxSecret);
  }, [config.fqlxSecret]);

  return <>{children}</>;
};
