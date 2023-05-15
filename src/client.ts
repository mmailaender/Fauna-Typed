'use client';

import { Client } from 'fauna';
import { useConfigStore } from './configStore';

class FqlxClient {
  private client: Client | undefined;
  private store = useConfigStore;

  getClient(): Client {
    if (!this.client) {
      const secret = this.store.getState().fqlxSecret;
      const endpoint = this.store.getState().fqlxEndpoint;

      if (secret) {
        this.client = new Client({
          endpoint,
          secret,
        });
      }
    }

    return this.client as Client;
  }
}

const fqlxClient = new FqlxClient();

export const callFqlxQuery = async (query: string) => {
  try {
    return await (await fqlxClient.getClient().query({ query })).data;
  } catch (error: any) {
    console.log('error.message======', error?.message, error);
    // throw error;
  }
};
