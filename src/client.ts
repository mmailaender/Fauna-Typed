'use client';

import { Client } from 'fauna';
import { useConfigStore } from './configStore';

class FqlxClient {
  private client: Client | undefined;
  private store = useConfigStore;

  getClient(): Client {
    if (!this.client) {
      const secret = this.store.getState().fqlxSecret;
      const endpoint = (this.store.getState().fqlxEndpoint as unknown) as URL;

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
  console.log({ query });
  try {
    return await (await fqlxClient.getClient().query({ query })).data;
  } catch (error) {
    console.error(error);
    // throw error;
  }
};
