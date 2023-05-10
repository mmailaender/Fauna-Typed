'use client';

import { Client } from 'fauna';
import { useConfigStore } from './configStore';

console.log('===========secret in client======', useConfigStore.getState());

class FqlxClient {
  private client: Client | undefined;
  private store = useConfigStore;

  getClient(): Client {
    if (!this.client) {
      console.log('fqlxStore.getState()========', this.store.getState());
      const secret = this.store.getState().fqlxSecret;
      const endpoint = (this.store.getState().fqlxEndpoint as unknown) as URL;
      console.log('========secret=====', secret);
      if (secret) {
        console.log('========new client creating=====', secret);

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
    console.error(error);
    throw error;
  }
};
