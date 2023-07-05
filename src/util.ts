import { convertToCapitalCase, getKeyType } from './helper';

export const topLevelInterfaces = `
  import {
    AllMethods,
    FirstMethods,
    PaginateData,
    WhereMethods,
    ByIdMethods,
    CreateMethods,
    DeleteMethods,
    ExecMethods,
    PromisifyExecMethods,
    UpdateMethods,
    FirstWhereMethods,
    SetMethods,
  } from 'fqlx-client'
  \n`;

export const createTypedefsMethods = (
  key: string,
  fieldsEntries: [string, any][]
): string => {
  let params = '';
  let exampleText = '';

  fieldsEntries.forEach((fieldEntry: any, index: number) => {
    const fieldKey = fieldEntry[0];

    if (fieldKey.toLowerCase() !== 'id') {
      const str = convertToCapitalCase(fieldKey);

      params = params.concat(
        `* @param { ${getKeyType(
          fieldEntry[1],
          fieldKey
        )} } input.${fieldKey} ${str} for the ${key}`
      );

      if (fieldsEntries.length !== index + 1) {
        params = params.concat(`\n`);
      }

      exampleText = exampleText.concat(
        ` \n * ${fieldKey}: "Value of the ${fieldKey}"  `
      );
    }
  });

  return `export interface ${key}Methods {
      /**
       * all method get the set of all documents in the ${key} collection.
       * 
       * @param
       * 
       * @returns {AllMethods<${key}>} method returns the set of all documents in ${key} collection for the given range.
       * 
       * @example
       * query.${key}.all().exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-all#signature See more...}
       */
      all(): AllMethods<${key}>;

      /**
       * create method creates a ${key} document in the collection with the provided property values.
       * 
       * @param {${key}Input | string} input - will be the ${key} which you want to add.
         ${params}
       *
       * @returns {CreateMethods<${key}>} return new document.
       * 
       * @example
       * query.${key}.create({ ${exampleText} 
       * }).exec()
       * OR
       * query.${key}.create(\`{ ${exampleText} 
       * }\`).exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-create#signature See more...}
       */
    create(input: (${key}Input | string)): CreateMethods<${key}>;

      /**
       * byId method get a ${key} document by its document ID.
       * This will returns available Fqlx byId methods
       * 
       * @param {string} id - The ID of the document to retrieve
       * 
       * @returns {ByIdMethods<${key}, ${key}Input>} return document when it exists and is accessible, else return
       * null when the document does not exist or is inaccessible.
       * 
       * @example
       * query.${key}.byId("21545645646554").exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-byid#signature See more...}
       */
       byId(id: string): ByIdMethods<${key}, ${key}Input>

       /**
        * first where method get the first matching value from the Set.
        * 
        * @param {(inputCondition: ((data: T) => boolean) | string)} function takes in a document of type T and returns a boolean
        * 
        * @returns {FirstWhereMethods<T>}  returns the first matching value in the Set, or null if the Set is empty or no values match.
        * 
        * @example
        * query.Address.all().firstWhere((data) => data.country == 'uk').exec();
        * OR
        * query.Address.all().firstWhere(\`(data) => data.\${dynamicKey}\ == "\${dynamicValueToCheck}\"\`).exec();
        * 
        * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/firstwhere#description See more...}
        */
       firstWhere(inputCondition: ((data: ${key}) => boolean) | string): FirstWhereMethods<${key}>;
    }\n\n`;
};
