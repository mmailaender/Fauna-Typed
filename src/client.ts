import { Client, endpoints } from 'fauna';

export const fqlxClient = new Client({
  endpoint: endpoints.preview,
  secret: process.env.FAUNA_DECHEA_ENV__ADMIN__TOKEN,
});

export const callFqlxQuery = async (query: string) => {
  try {
    return await (
      await fqlxClient.query({ query })
    ).data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
