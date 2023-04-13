export interface PromisifyExecMethods<T> {
  exec: () => Promise<T>;
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
  update: (input: U) => UpdateMethods<T>;
  delete: () => DeleteMethods<T>;
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
  create: (input: AddressInput) => CreateMethods<Address>;
  byId: (id: string) => ByIdMethods<Address, AddressInput>;
}

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
  Order: OrderMethods;
  Address: AddressMethods;
  Product: ProductMethods;
  Test: TestMethods;
}
