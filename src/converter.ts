import fs from 'fs';
import path from 'path';
import { getKeyType, getPascalCaseString } from './helper';
import { topLevelInterfaces, createTypedefsMethods } from './util';
import { getSchema } from './schema';
import { getCollectionsWithFields } from './collectionsWithFields';

interface Value {
  fields: {
    [key: string]: string;
  };
  constraints: {
    required: string[];
  };
}

const schema = getSchema();

let typeSchema = '';
let queryInterfaceKeyValue = '';

const createInterface = (key: string, value: Value, keyPath: string = '') => {
  const fields = value?.fields || {};
  const requiredFields = value?.constraints?.required || [];
  const keyInPascalCase = getPascalCaseString(key);
  const fieldsEntries = Object.entries(fields);

  let mainInterfaceKeyValue = '';
  let inputInterfaceKeyValue = '';

  fieldsEntries.forEach(fieldEntry => {
    const fieldValue = fieldEntry[1];
    const fieldKey = fieldEntry[0];
    const mappedKeyPath = keyPath ? `${keyPath}.${fieldKey}` : fieldKey;

    const isRequired = requiredFields.some(
      requiredField => requiredField === mappedKeyPath
    );

    // TODO: uncomment if need to add object method in Query
    // const fieldKeyPascalCase = getPascalCaseString(fieldKey);
    const valueType = getKeyType(fieldValue, fieldKey);

    // Creating interface for embedded objects
    if (typeof fieldValue === 'object') {
      createInterface(
        fieldKey,
        {
          fields: fieldValue,
          constraints: value.constraints,
        },
        mappedKeyPath
      );

      // TODO: uncomment if need to add object method in Query
      // queryInterfaceKeyValue = queryInterfaceKeyValue.concat(
      //   `/**\n * @returns This return fqlx methods for the ${fieldKeyPascalCase} \n */ \n ${fieldKeyPascalCase}:  ${fieldKeyPascalCase}Methods;\n`
      // );
    }

    // schema key value
    mainInterfaceKeyValue = mainInterfaceKeyValue.concat(
      `/**\n * ${fieldKey} for the ${keyInPascalCase}\n */\n ${fieldKey}${
        isRequired ? '' : '?'
      }: ${valueType};\n`
    );

    const fieldKeyInLowercase = fieldKey.toLowerCase();

    if (!['ts'].includes(fieldKeyInLowercase)) {
      inputInterfaceKeyValue = inputInterfaceKeyValue.concat(
        `/**\n * ${fieldKey} for the ${keyInPascalCase}\n */\n ${fieldKey}${
          fieldKeyInLowercase === 'id' ? '?' : isRequired ? '' : '?'
        }: ${valueType};\n`
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
  let typedFunctionString = '';

  schemaKeys.forEach((key: string) => {
    if (key === 'Functions') {
      // Creating functions type defs...
      Object.entries(schema[key as keyof typeof schema]).forEach(
        ([functionName, functionBody]) => {
          typedFunctionString = typedFunctionString.concat(
            `${functionName}: ${functionBody};\n`
          );
        }
      );

      typeSchema = typeSchema.concat(``);
    } else {
      const keyInPascalCase = getPascalCaseString(key);
      queryInterfaceKeyValue = queryInterfaceKeyValue.concat(
        `/**\n * @returns This return fqlx methods for the ${keyInPascalCase} \n */ \n${keyInPascalCase}: ${keyInPascalCase}Methods;\n`
      );
      createInterface(key, schema[key as keyof typeof schema]);
    }
  });

  typeSchema = typeSchema.concat(`export interface Functions {
    ${typedFunctionString}
  }; \n\n
  
  export interface Query {
    Set: SetMethods;
    Functions: Functions;
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

fs.writeFileSync(
  path.resolve(
    process.env?.PWD as string,
    `fqlx-generated/collectionsWithFields.ts`
  ),
  `export const collectionsWithFields = ${JSON.stringify(
    getCollectionsWithFields(schema)
  )}`,
  {
    encoding: 'utf-8',
  }
);
