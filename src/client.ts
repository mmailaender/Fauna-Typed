import { Client, endpoints } from 'fauna';
import { useFqlxStore } from './FqlxProvider';

class FqlxClient {
  static client: Client;

  static getClient() {
    if (!this.client) {
      const secret = useFqlxStore.getState().fqlxSecret;
      console.log('========secret=====', secret);
      if (secret) {
        this.client = new Client({
          endpoint: endpoints.preview,
          secret,
        });
      }
    }

    return this.client;
  }
}

export const fqlxClient = FqlxClient.getClient();

export const callFqlxQuery = async (query: string) => {
  try {
    return await (await fqlxClient.query({ query })).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
