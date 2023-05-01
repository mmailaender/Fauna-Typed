'use client';

import React from 'react';
import { useEffect } from 'react';
import { StoreApi, UseBoundStore, create } from 'zustand';

export interface FqlxState {
  fqlxSecret: string;
  setFqlxSecret(secret: string): void;
}

export type Store = UseBoundStore<StoreApi<FqlxState>>;

const useFqlxStore = create<FqlxState>(set => ({
  fqlxSecret: '',
  setFqlxSecret: (secret: string) => set(() => ({ fqlxSecret: secret })),
}));

class FqlxStore {
  store: Store | undefined;

  getStore(): Store {
    if (!this.store) {
      this.store = useFqlxStore;
    }

    return this.store as Store;
  }
}

export const fqlxStore = new FqlxStore().getStore();

export const FqlxProvider = ({
  config,
  children,
}: {
  config: { fqlxSecret: string };
  children: React.ReactElement;
}): JSX.Element => {
  const { setFqlxSecret, fqlxSecret } = fqlxStore((state: FqlxState) => state);
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

  console.log('secret in store========', fqlxSecret);

  return children;
};
