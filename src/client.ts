import { Client, endpoints } from 'fauna';
import React, { useMemo } from 'react';
import { create } from 'zustand';

interface FqlxStore {
  fqlxSecret: string;
  setFqlxSecret(secret: string): void
}

const useFqlxStore = create<FqlxStore>((set) => ({
  fqlxSecret: '',
  setFqlxSecret: (secret:string) => set(() => ({ fqlxSecret: secret })),
}));

export const FqlxProvider = ({ config, children }: {config: {fqlxSecret: string},children: React.ReactElement}):JSX.Element => {
  const { setFqlxSecret } = useFqlxStore(state => state);

  useMemo(() => {
    setFqlxSecret(config.fqlxSecret)
  }, [config.fqlxSecret]);

  return children;
};

class FqlxClient {
  static client: Client

  static getClient() {
    if (!this.client) {
      this.client = new Client({
        endpoint: endpoints.preview,
        secret: useFqlxStore.getState().fqlxSecret,
      });
    }

    return this.client
  }
}

export const fqlxClient = FqlxClient.getClient()

export const callFqlxQuery = async (query: string) => {
  try {
    return await (await fqlxClient.query({ query })).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
