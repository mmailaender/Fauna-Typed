import { convertToCapitalCase, getKeyType } from './helper';

export const TopLevelInterfaces = `export interface PromisifyExecMethods<T> {
  /**
   * Executes the query and returns a Promise that resolves with the query results
   * 
   * @param
   * 
   * @returns {Promise<T>} A Promise that resolves with the query results
   */
    exec(): Promise<T>;
  }

  export interface ExecMethods<T> {
    /**
     * Executes the query and returns the query results
     * 
     * @param
     * 
     * @returns {T} Query results
     */
      exec(): T;
    }
  
  export interface CreateMethods<T> extends PromisifyExecMethods<T> {}
  
  export interface WhereMethods<T> extends ExecMethods<PaginateData<T>> {}
  
  export interface FirstMethods<T> extends ExecMethods<T> {}

  export interface DeleteMethods<T> extends PromisifyExecMethods<T> {}

  export interface UpdateMethods<T> extends PromisifyExecMethods<T> {}
  
  export interface AllMethods<T>
    extends ExecMethods<PaginateData<T>> {
    /**
     * first method get the first value in the Set, or null if the Set is empty.
     * 
     * @param
     * 
     * @returns {FirstMethods<T>} First Set value, or null for an empty Set.
     * 
     * @example
     * query.Address.all().first().exec()
     * 
     * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/first#signature See more...}
     */
    first(): FirstMethods<T>;

    /**
     * where method set a subset of matching Set values.
     * 
     * @param {(inputCondition: (data: T) => boolean)} function takes in a document of type T and returns a boolean
     * 
     * @returns {WhereMethods<T>} return Set representing the Set values that match the predicate Function.
     * 
     * @example
     * query.Address.all().where((data) => data.country == 'uk').exec()
     * 
     * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/where#signature See more...}
     */
    where(inputCondition: (data: T) => boolean): WhereMethods<T>;
  }
  
  export interface PaginateData<T> {
    data: T[];
    after?: string | null | undefined;
    before?: string | null | undefined;
  }

  export interface ByIdMethods<T, U> extends PromisifyExecMethods<T> {
    /**
     * The update() method updates the document with the object fields and returns the updated document.
     * 
     * @param {U} input input is object with fields that needs to be updated
     * 
     * @returns returns document with updated fields.
     * 
     * @example
     * query.Address.byId('360427545614615075').update({
     *  street: "Vijay Nagar Road",
     *  city: "Indore",
     *  state: "Madhya Pradesh",
     *  country: "India",
     *  postCode: "452010"
     * }
     * }).exec()
     *
     * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/document/update#description See more...}
     */
    update(input: U): UpdateMethods<T>;

     /**
      * delete method delete the document.
      * 
      * @param
      * 
      * @returns return an Object with the identifier fields from the deleted document.
      * 
      * @example
      * query.Address.byId('360427545614615075').delete().exec()
      *
      * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/document/delete#description See more...}
      */
     delete(): DeleteMethods<T>;
  }
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
       * @param {${key}Input} input - will be the ${key} which you want to add.
         ${params}
       *
       * @returns {CreateMethods<${key}>} return new document.
       * 
       * @example
       * query.${key}.create({ ${exampleText} 
       * }).exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-create#signature See more...}
       */
    create(input: ${key}Input): CreateMethods<${key}>;

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
    }\n\n`;
};
