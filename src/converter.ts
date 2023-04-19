import fs from 'fs';
import path from 'path';
import { cosmiconfigSync } from 'cosmiconfig';
import { getKeyType, getPascalCaseString } from './helper';
import { topLevelInterfaces, createTypedefsMethods } from './util';

console.log(
  process.env.NODE_ENV,
  'process.env?.PWD==========',
  process.env?.PWD
);

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

const dir = `${process.env?.PWD}/fqlx-generated`;
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

fs.writeFileSync(
  path.resolve(process.env?.PWD as string, `fqlx-generated/typedefs.ts`),
  topLevelInterfaces.concat(typeSchema),
  {
    encoding: 'utf-8',
  }
);
