'use client';

import { Client } from 'fauna';
import { useConfigStore } from './configStore';

class FqlxClient {
  private client: Client | undefined;
  private store = useConfigStore;
  private secretToken: string = '';

  getClient(): Client {
    const secret = this.store.getState().fqlxSecret;
    if (!this.client || this.secretToken !== secret) {
      const endpoint = this.store.getState().fqlxEndpoint;
      this.secretToken = secret;
      console.log('secret in client=========', secret);

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
  } catch (error) {
    throw error;
  }
};
