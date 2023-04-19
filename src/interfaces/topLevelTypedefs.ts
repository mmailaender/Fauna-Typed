export interface PromisifyExecMethods<T> {
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

export interface AllMethods<T> extends ExecMethods<PaginateData<T>> {
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
