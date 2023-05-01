'use client';

import { Client, endpoints } from 'fauna';
import { useFqlxStore } from './FqlxProvider';

class FqlxClient {
  private client: Client | undefined;
  private store = useFqlxStore;

  getClient(): Client {
    if (!this.client) {
      console.log('fqlxStore.getState()========', this.store.getState());
      const secret = this.store.getState().fqlxSecret;
      console.log('========secret=====', secret);
      if (secret) {
        console.log('========new client creating=====', secret);

        this.client = new Client({
          endpoint: endpoints.preview,
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
    console.error(error);
    throw error;
  }
};
