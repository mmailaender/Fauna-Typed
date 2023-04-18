import fs from 'fs';
import path from 'path';
import { cosmiconfigSync } from 'cosmiconfig';
import { getKeyType, getPascalCaseString } from './helper';
import { TopLevelInterfaces, createTypedefsMethods } from './util';

// const cjsRequire = globalThis.require;

// const cjsLoader = (filePath: string) => {
//   return cjsRequire(filePath);
// };

const explorerSync = cosmiconfigSync('fqlx', {
  searchPlaces: ['fqlx.schema.json'],
});
const schema = explorerSync.search()?.config;

let typeSchema = '';
let queryInterfaceKeyValue = '';

const createInterface = (key: string, fields: object) => {
  const keyInPascalCase = getPascalCaseString(key);
  const fieldsEntries = Object.entries(fields);

  let mainInterfaceKeyValue = '';
  let inputInterfaceKeyValue = '';

  fieldsEntries.forEach(fieldEntry => {
    const fieldValue = fieldEntry[1];
    const fieldKey = fieldEntry[0];

    const fieldKeyPascalCase = getPascalCaseString(fieldKey);
    const valueType = getKeyType(fieldValue, fieldKey);

    // Creating interface for embedded objects
    if (typeof fieldValue === 'object') {
      createInterface(fieldKey, fieldValue);

      queryInterfaceKeyValue = queryInterfaceKeyValue.concat(
        `/**\n * @returns This return fqlx methods for the ${fieldKeyPascalCase} \n */ \n ${fieldKeyPascalCase}:  PaginateData<${fieldKeyPascalCase}> & ${fieldKeyPascalCase}Methods;\n`
      );
    }

    // schema key value
    mainInterfaceKeyValue = mainInterfaceKeyValue.concat(
      `/**\n * ${fieldKey} for the ${keyInPascalCase}\n */\n ${fieldKey}: ${valueType};\n`
    );

    if (fieldKey.toLowerCase() !== 'id') {
      inputInterfaceKeyValue = inputInterfaceKeyValue.concat(
        `/**\n * ${fieldKey} for the ${keyInPascalCase}\n */\n ${fieldKey}: ${valueType};\n`
      );
    }
  });

  typeSchema = typeSchema.concat(`export interface ${keyInPascalCase} {
    ${mainInterfaceKeyValue}
  }\n\n
  export interface ${keyInPascalCase}Input {
    ${inputInterfaceKeyValue}
  } \n\n
  ${createTypedefsMethods(keyInPascalCase, fieldsEntries)}
  `);
};

const generateTypeDefs = () => {
  const schemaKeys = Object.keys(schema);

  schemaKeys.forEach((key: string) => {
    const keyInPascalCase = getPascalCaseString(key);

    queryInterfaceKeyValue = queryInterfaceKeyValue.concat(
      `/**\n * @returns This return fqlx methods for the ${keyInPascalCase} \n */ \n${keyInPascalCase}: PaginateData<${keyInPascalCase}> & ${keyInPascalCase}Methods;\n`
    );
    createInterface(key, schema[key as keyof typeof schema].fields);
  });

  typeSchema = typeSchema.concat(`export interface Query {
    ${queryInterfaceKeyValue}
  }`);
};

generateTypeDefs();

if (
  fs.existsSync(
    `${process.env?.PWD}/node_modules/fqlx-client/dist/generated/typedefs.d.ts`
  )
) {
  fs.writeFileSync(
    path.resolve(
      process.env?.PWD || '',
      `node_modules/fqlx-client/dist/generated/typedefs.d.ts`
    ),
    TopLevelInterfaces.concat(typeSchema),
    {
      encoding: 'utf-8',
    }
  );
} else {
  fs.writeFileSync(
    './src/generated/typedefs.ts',
    TopLevelInterfaces.concat(typeSchema),
    {
      encoding: 'utf-8',
    }
  );
}
