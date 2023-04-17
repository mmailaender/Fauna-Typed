import fs from 'fs';
import { cosmiconfigSync } from 'cosmiconfig';
import { getPascalCaseString } from './helper';
import { TopLevelInterfaces, createTypedefsMethods } from './util';

console.log('running convertor start========');
const explorerSync = cosmiconfigSync('fqlx');
const schema = explorerSync.search()?.config
console.log('explorerSync.search=========', );

console.log('running convertor end========');

// const schemaStr = fs.readFileSync(
//   `../../../../../..${process.env.INIT_CWD}/${process.argv[process.argv.length - 1]}`,
//   { encoding: 'utf-8' }
// );
// const schema = JSON.parse(schemaStr);
console.log(schema)
const types = {
  int: 'number',
  float: 'number',
  string: 'string',
};

let typeSchema = '';
let queryInterfaceKeyValue = '';

const getKeyType = (value: any, fieldKey: string) => {
  // return type for embedded onject
  if (typeof value === 'object') {
    return getPascalCaseString(fieldKey);
  }

  return value
    .split('|')
    .map((s: string) => types[s.trim() as keyof typeof types] || s)
    .join(' | ');
};

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
        `${fieldKeyPascalCase}:  ${fieldKeyPascalCase}Methods;\n`
      );
    }

    mainInterfaceKeyValue = mainInterfaceKeyValue.concat(
      `${fieldKey}: ${valueType};\n`
    );

    if (fieldKey.toLowerCase() !== 'id') {
      inputInterfaceKeyValue = inputInterfaceKeyValue.concat(
        `${fieldKey}: ${valueType};\n`
      );
    }
  });

  typeSchema = typeSchema.concat(`export interface ${keyInPascalCase} {
    ${mainInterfaceKeyValue}
  }\n\n
  export interface ${keyInPascalCase}Input {
    ${inputInterfaceKeyValue}
  } \n\n
  ${createTypedefsMethods(keyInPascalCase)}
  `);
};

const generateTypeDefs = () => {
  const schemaKeys = Object.keys(schema);

  schemaKeys.forEach((key: string) => {
    const keyInPascalCase = getPascalCaseString(key);

    queryInterfaceKeyValue = queryInterfaceKeyValue.concat(
      `${keyInPascalCase}: ${keyInPascalCase}Methods;\n`
    );
    createInterface(key, schema[key as keyof typeof schema].fields);
  });

  typeSchema = typeSchema.concat(`export interface Query {
    ${queryInterfaceKeyValue}
  }`);
};

generateTypeDefs();

fs.writeFileSync(
  './src/generated/typedefs.ts',
  TopLevelInterfaces.concat(typeSchema),
  {
    encoding: 'utf-8',
  }
);
