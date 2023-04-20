import { cosmiconfigSync } from 'cosmiconfig';

export const getSchema = () => {
  const explorerSync = cosmiconfigSync('fqlx', {
    searchPlaces: ['fqlx.schema.json'],
  });

  const schema = explorerSync.search()?.config;

  if (!schema) {
    throw new Error(
      'Schema File Not Found OR Invalid Schema Format: Please add fqlx.schema.json file with valid json format'
    );
  }

  return schema;
};
