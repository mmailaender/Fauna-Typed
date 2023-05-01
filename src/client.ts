'use client';

import { Client, endpoints } from 'fauna';
import { fqlxStore } from './FqlxProvider';

class FqlxClient {
  static client: Client;
  static store = fqlxStore.getStore();

  static getClient() {
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

    return this.client;
  }
}

export const callFqlxQuery = async (query: string) => {
  try {
    return await (await FqlxClient.getClient().query({ query })).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
