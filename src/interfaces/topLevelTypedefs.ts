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

export interface CreateMethods<T>
  extends ProjectionMethods<T, T>,
    PromisifyExecMethods<T> {}

export type OrderMethodInput<T> =
  | `asc(.${string & keyof T})`
  | `desc(.${string & keyof T})`;

export interface OrderMethods<T>
  extends FqlxFirst<T>,
    ProjectionMethods<T, PaginateData<T>>,
    ExecMethods<PaginateData<T>> {}

export interface DistinctMethod<T> extends ExecMethods<PaginateData<T>> {
  /**
   * The distinct() method returns the unique elements in the array.
   *
   * @returns Unique elements in the array.
   *
   * @example
   * query.Address.all().map(address => address.country).distinct().exec();
   * OR
   * query.Address.where(data => data.country == "US").map(address => address.city).distinct().exec();
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/builtin_functions/array/distinct#description See more...}
   */
  distinct(): BaseDistinctMethod<T>;
}

export interface BaseDistinctMethod<T> extends ExecMethods<PaginateData<T>> {}


export interface BaseMapMethod<T>
  extends ExecMethods<PaginateData<T>>,
    DistinctMethod<T> {}

export interface CountMethod<T>  extends ExecMethods<PaginateData<T>> {
  /**
   * The count() method returns the unique elements in the array.
   *
   * @returns Unique elements in the array.
   *
   * @example
   * query.Address.all().count().exec();
   * OR
   * query.Address.where(data => data.country == "US").count().exec();
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/count See more...}
   */
  count(): BaseCountMethod<T>;
}

export interface BaseCountMethod<T> extends ExecMethods<PaginateData<T>> {}

export interface PaginateMethod<T> {
  /**
   * The paginate() method returns the unique elements in the array.
   *
   * @returns Unique elements in the array.
   *
   * @example
   * query.Set.paginate("cursor")
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/paginate See more...}
   */
  paginate(cursor: string): BasePaginateMethod<T>;
}

export interface BasePaginateMethod<T> extends PromisifyExecMethods<PaginateData<T>> {}

export interface MapMethod<T> {
  /**
   * Create an Array by executing a function for each Array element.
   *
   * @param callbackFn Anonymous Function to invoke for each element of the calling Array. The function accepts an Array element as an argument.
   *
   * @returns A new Array that is the result of function invoked on each element of the calling Array.
   *
   * @example
   * query.Address.all().map(address => address.country).exec();
   * OR
   * query.Address.where(data => data.country == "US").map(address => address.city).exec();
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/builtin_functions/array/map#description See more...}
   */
  map(
    callbackFn: (data: T) => string | boolean | number | Partial<T>
  ): BaseMapMethod<T>;
}

export interface FqlxOrder<T> extends ExecMethods<PaginateData<T>> {
  /**
   *
   * order method creates a Set by applying an Ordering to the values of this Set, and returns the new Set.
   *
   * @param {"asc(.key)" | "desc(.key)"} inputOrder creates Set with ordering applied.
   *
   * @returns {OrderMethods<T>} returns the new Set with ordering applied.
   *
   * @example
   * query.Address.all().order("asc(.id)").exec()
   * query.Address.all().order("desc(.id)").exec()
   * query.Address.all().where((data) => data.id != 123).order("asc(.id)").exec()
   * query.Address.all().where((data) => data.id != 123).order("desc(.id)").exec()
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/order#signature See more...}
   *
   */
  order(inputOrder: OrderMethodInput<T>): OrderMethods<T>;
}

export interface FirstWhereMethods<T>
  extends ProjectionMethods<T, T>,
    ExecMethods<T> {}

export interface FirstMethods<T>
  extends ProjectionMethods<T, T>,
    ExecMethods<T> {}

export interface FqlxFirst<T> {
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
}

export interface WhereMethods<T>
  extends FqlxOrder<T>,
    MapMethod<T>,
    ProjectionMethods<T, PaginateData<T>>,
    ExecMethods<PaginateData<T>>, CountMethod<T> {}

export type ProjectionFieldsInputType<T> = {
  [K in keyof T]: boolean | Partial<ProjectionFieldsInputType<T[K]>>;
};

export interface ProjectionMethods<T, RES_TYPE> {
  /**
   * Projection allows you to select the fields to be returned.
   *
   * @param projectionFields Fields you want to get as response.
   *
   * @returns Fields value for which you requested, If a requested field doesn’t exist in the projected object, the returned field value is set to null.
   *
   * @example
   * query.Address.all().project({ country: true }).exec();
   * OR
   * query.Address.all().project({ country: {code : true} }).exec();
   * OR
   * query.Address.all().project({ countries: [{code : true}] }).exec();
   * OR
   * query.Address.where((data) => data.country == "US").project({ country: true }).exec();
   * OR
   * query.Address.firstWhere((data) => data.country == "US").project({ country: true }).exec();
   * OR
   * query.Address.all().first().project({ country: true }).exec();
   * OR
   * query.Address.all().order(asc(.id)).project({ country: true }).exec();
   * OR
   * query.Address.byId('360427545614615075').project({ country: true }).exec();
   * OR
   * query.Address.byId('360427545614615075').delete().project({ country: true }).exec();
   * OR
   * query.Address.byId('360427545614615075').update({street: "Vijay Nagar Road"}).project({ country: true }).exec();
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/language/projection See more...}
   */
  project(
    projectionFields: Partial<ProjectionFieldsInputType<T>>
  ): ExecMethods<RES_TYPE>;
}

export interface DeleteMethods<T>
  extends ProjectionMethods<T, T>,
    PromisifyExecMethods<T> {}

export interface UpdateMethods<T>
  extends ProjectionMethods<T, T>,
    PromisifyExecMethods<T> {}

export interface AllMethods<T>
  extends FqlxOrder<T>,
    FqlxFirst<T>,
    ProjectionMethods<T, PaginateData<T>>,
    ExecMethods<PaginateData<T>> {
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
   * query.Address.all().firstWhere(`(data) => data.${dynamicKey} == "${dynamicValueToCheck}"`).exec();
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/firstwhere#description See more...}
   */
  firstWhere(
    inputCondition: ((data: T) => boolean) | string
  ): FirstWhereMethods<T>;

  /**
   * where method set a subset of matching Set values.
   *
   * @param {(inputCondition: ((data: T) => boolean) | string) } function takes in a document of type T and returns a boolean
   *
   * @returns {WhereMethods<T>} return Set representing the Set values that match the predicate Function.
   *
   * @example
   * query.Address.all().where((data) => data.country == 'uk').exec();
   * OR
   * query.Address.all().where(`(data) => data.${dynamicKey} == "${dynamicValueToCheck}"`).exec();
   *
   * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/set/where#signature See more...}
   */
  where(inputCondition: ((data: T) => boolean) | string): WhereMethods<T>;
}

export interface SetMethods<T>
  extends PaginateMethod<T> {
}

export interface PaginateData<T> {
  data: T[];
  after?: string | null | undefined;
  before?: string | null | undefined;
}

export interface ByIdMethods<T, U>
  extends ProjectionMethods<T, T>,
    PromisifyExecMethods<T> {
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
