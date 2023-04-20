import { cosmiconfigSync } from 'cosmiconfig';
import fs from 'fs';

export const getSchema = () => {
  if (!fs.existsSync(`${process.env?.PWD}/fqlx.schema.json`)) {
    throw new Error(
      'Schema File Not Found: Add fqlx.schema.json file in root directory'
    );
  }

  const explorerSync = cosmiconfigSync('fqlx', {
    searchPlaces: ['fqlx.schema.json'],
  });

  const schema = explorerSync.search()?.config;

  if (!schema) {
    throw new Error('Invalid Schema Format: Please add valid json format');
  }

  return schema;
};
