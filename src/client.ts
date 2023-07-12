'use client';

import { Client, Query } from 'fauna';
import { useConfigStore } from './configStore';

class FqlxClient {
  private client: Client | undefined;
  private store = useConfigStore;
  private secretToken: string = '';

  getClient(): Client {
    const secret = this.store.getState().fqlxSecret;

    // Create new client if client not exist OR if secret change
    if (!this.client || this.secretToken !== secret) {
      const endpoint = this.store.getState().fqlxEndpoint;
      this.secretToken = secret;

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
    return await (
      await fqlxClient.getClient().query(({ query } as unknown) as Query)
    ).data;
  } catch (error) {
    throw error;
  }
};
