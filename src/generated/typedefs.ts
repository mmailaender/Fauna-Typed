export interface PromisifyExecMethods<T> {
  /**
   * Returns Fqlx API response
   * @param
   * @returns Returns promised data
   */
  exec(): Promise<T>;
}

export interface ExecMethods<T> {
  exec: () => T;
}

export interface CreateMethods<T> extends PromisifyExecMethods<T> {}

export interface WhereMethods<T> extends ExecMethods<PaginateData<T>> {}

export interface FirstMethods<T> extends ExecMethods<T> {}

export interface DeleteMethods<T> extends PromisifyExecMethods<T> {}

export interface UpdateMethods<T> extends PromisifyExecMethods<T> {}

export interface AllMethods<T> extends ExecMethods<PaginateData<T>> {
  first: () => FirstMethods<T>;
  where: (inputCondition: (data: T) => boolean) => WhereMethods<T>;
}

export interface PaginateData<T> {
  data: T[];
  after?: string | null | undefined;
  before?: string | null | undefined;
}

export interface ByIdMethods<T, U> extends PromisifyExecMethods<T> {
  /**
   * This returns available Fqlx `update` methods
   * @param {U} input Data to update
   * @returns {UpdateMethods<T>} Returns update methods
   */
  update(input: U): UpdateMethods<T>;
  /**
   * This returns available Fqlx `delete` methods
   * @param
   * @returns {DeleteMethods<T>} Returns delete methods
   */
  delete(): DeleteMethods<T>;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postCode: number | string;
}

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  country: string;
  postCode: number | string;
}

export interface AddressMethods {
  all: () => AllMethods<Address>;
  /**
   * This will create a Address in Fqlx
   * @example
   * query.Address.create({
   *  street: "1908 W Chicago Ave",
   *  city: "Chicago",
   *  state: "Indiana",
   *  country: "United States",
   *  postCode: "60622"
   * });
   *
   * This will return available methods for create
   *
   * @param {AddressInput} address The Address which you want to add
   * @param {string} address.street Street
   * @param {string} address.city City
   * @param {string} address.state State
   * @param {string} address.country Country
   * @param {string} address.postCode Post Code
   * @returns {Address} { exec(): Promise<Address> }
   */
  create(address: AddressInput): CreateMethods<Address>;
  /**
   * This will returns available Fqlx `byId` methods
   * @param {string} id Fqlx Document Id
   * @returns byId methods
   */
  byId(id: string): ByIdMethods<Address, AddressInput>;
}

let address: AddressMethods;

// address.create({}).exec();
// address.byId(id).update(input).exec();
// address.byId(id).delete(input).exec();

export interface Order {
  id: string;
  name: string | unknown;
  age: number | string;
  address: Address;
}

export interface OrderInput {
  name: string | unknown;
  age: number | string;
  address: Address;
}

export interface OrderMethods {
  all: () => AllMethods<Order>;
  create: (input: OrderInput) => CreateMethods<Order>;
  byId: (id: string) => ByIdMethods<Order, OrderInput>;
}

export interface Product {
  id: string;
  manufacturerProductId: string;
}

export interface ProductInput {
  manufacturerProductId: string;
}

export interface ProductMethods {
  all: () => AllMethods<Product>;
  create: (input: ProductInput) => CreateMethods<Product>;
  byId: (id: string) => ByIdMethods<Product, ProductInput>;
}

export interface Test {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TestInput {
  firstName: string;
  lastName: string;
}

export interface TestMethods {
  all: () => AllMethods<Test>;
  create: (input: TestInput) => CreateMethods<Test>;
  byId: (id: string) => ByIdMethods<Test, TestInput>;
}

export interface Query {
  Order: PaginateData<Order> & OrderMethods;
  /**
   * This returns available Fqlx methods
   */
  Address: PaginateData<Address> & AddressMethods;
  Product: PaginateData<Product> & ProductMethods;
  Test: PaginateData<Test> & TestMethods;
}

// let query : Query;

// query.Address.create({})
