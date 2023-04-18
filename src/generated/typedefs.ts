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
  
export interface Address {
    /**
 * id for the Address
 */
 id: string;
/**
 * street for the Address
 */
 street: string;
/**
 * city for the Address
 */
 city: string;
/**
 * state for the Address
 */
 state: string;
/**
 * country for the Address
 */
 country: string;
/**
 * postCode for the Address
 */
 postCode: number | string;

  }


  export interface AddressInput {
    /**
 * street for the Address
 */
 street: string;
/**
 * city for the Address
 */
 city: string;
/**
 * state for the Address
 */
 state: string;
/**
 * country for the Address
 */
 country: string;
/**
 * postCode for the Address
 */
 postCode: number | string;

  } 


  export interface AddressMethods {
      /**
       * all method get the set of all documents in the Address collection.
       * 
       * @param
       * 
       * @returns {AllMethods<Address>} method returns the set of all documents in Address collection for the given range.
       * 
       * @example
       * query.Address.all().exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-all#signature See more...}
       */
      all(): AllMethods<Address>;

      /**
       * create method creates a Address document in the collection with the provided property values.
       * 
       * @param {AddressInput} input - will be the Address which you want to add.
         * @param { string } input.street Street for the Address
* @param { string } input.city City for the Address
* @param { string } input.state State for the Address
* @param { string } input.country Country for the Address
* @param { number | string } input.postCode PostCode for the Address
       *
       * @returns {CreateMethods<Address>} return new document.
       * 
       * @example
       * query.Address.create({  
 * street: "Value of the street"   
 * city: "Value of the city"   
 * state: "Value of the state"   
 * country: "Value of the country"   
 * postCode: "Value of the postCode"   
       * }).exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-create#signature See more...}
       */
    create(input: AddressInput): CreateMethods<Address>;

      /**
       * byId method get a Address document by its document ID.
       * This will returns available Fqlx byId methods
       * 
       * @param {string} id - The ID of the document to retrieve
       * 
       * @returns {ByIdMethods<Address, AddressInput>} return document when it exists and is accessible, else return
       * null when the document does not exist or is inaccessible.
       * 
       * @example
       * query.Address.byId("21545645646554").exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-byid#signature See more...}
       */
       byId(id: string): ByIdMethods<Address, AddressInput>
    }


  export interface Order {
    /**
 * id for the Order
 */
 id: string;
/**
 * name for the Order
 */
 name: string |  unknown;
/**
 * age for the Order
 */
 age: number | string;
/**
 * address for the Order
 */
 address: Address;

  }


  export interface OrderInput {
    /**
 * name for the Order
 */
 name: string |  unknown;
/**
 * age for the Order
 */
 age: number | string;
/**
 * address for the Order
 */
 address: Address;

  } 


  export interface OrderMethods {
      /**
       * all method get the set of all documents in the Order collection.
       * 
       * @param
       * 
       * @returns {AllMethods<Order>} method returns the set of all documents in Order collection for the given range.
       * 
       * @example
       * query.Order.all().exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-all#signature See more...}
       */
      all(): AllMethods<Order>;

      /**
       * create method creates a Order document in the collection with the provided property values.
       * 
       * @param {OrderInput} input - will be the Order which you want to add.
         * @param { string |  unknown } input.name Name for the Order
* @param { number | string } input.age Age for the Order
* @param { Address } input.address Address for the Order
       *
       * @returns {CreateMethods<Order>} return new document.
       * 
       * @example
       * query.Order.create({  
 * name: "Value of the name"   
 * age: "Value of the age"   
 * address: "Value of the address"   
       * }).exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-create#signature See more...}
       */
    create(input: OrderInput): CreateMethods<Order>;

      /**
       * byId method get a Order document by its document ID.
       * This will returns available Fqlx byId methods
       * 
       * @param {string} id - The ID of the document to retrieve
       * 
       * @returns {ByIdMethods<Order, OrderInput>} return document when it exists and is accessible, else return
       * null when the document does not exist or is inaccessible.
       * 
       * @example
       * query.Order.byId("21545645646554").exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-byid#signature See more...}
       */
       byId(id: string): ByIdMethods<Order, OrderInput>
    }


  export interface Product {
    /**
 * id for the Product
 */
 id: string;
/**
 * manufacturerProductId for the Product
 */
 manufacturerProductId: string;

  }


  export interface ProductInput {
    /**
 * manufacturerProductId for the Product
 */
 manufacturerProductId: string;

  } 


  export interface ProductMethods {
      /**
       * all method get the set of all documents in the Product collection.
       * 
       * @param
       * 
       * @returns {AllMethods<Product>} method returns the set of all documents in Product collection for the given range.
       * 
       * @example
       * query.Product.all().exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-all#signature See more...}
       */
      all(): AllMethods<Product>;

      /**
       * create method creates a Product document in the collection with the provided property values.
       * 
       * @param {ProductInput} input - will be the Product which you want to add.
         * @param { string } input.manufacturerProductId ManufacturerProductId for the Product
       *
       * @returns {CreateMethods<Product>} return new document.
       * 
       * @example
       * query.Product.create({  
 * manufacturerProductId: "Value of the manufacturerProductId"   
       * }).exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-create#signature See more...}
       */
    create(input: ProductInput): CreateMethods<Product>;

      /**
       * byId method get a Product document by its document ID.
       * This will returns available Fqlx byId methods
       * 
       * @param {string} id - The ID of the document to retrieve
       * 
       * @returns {ByIdMethods<Product, ProductInput>} return document when it exists and is accessible, else return
       * null when the document does not exist or is inaccessible.
       * 
       * @example
       * query.Product.byId("21545645646554").exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-byid#signature See more...}
       */
       byId(id: string): ByIdMethods<Product, ProductInput>
    }


  export interface Test {
    /**
 * id for the Test
 */
 id: string;
/**
 * firstName for the Test
 */
 firstName: string;
/**
 * lastName for the Test
 */
 lastName: string;

  }


  export interface TestInput {
    /**
 * firstName for the Test
 */
 firstName: string;
/**
 * lastName for the Test
 */
 lastName: string;

  } 


  export interface TestMethods {
      /**
       * all method get the set of all documents in the Test collection.
       * 
       * @param
       * 
       * @returns {AllMethods<Test>} method returns the set of all documents in Test collection for the given range.
       * 
       * @example
       * query.Test.all().exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-all#signature See more...}
       */
      all(): AllMethods<Test>;

      /**
       * create method creates a Test document in the collection with the provided property values.
       * 
       * @param {TestInput} input - will be the Test which you want to add.
         * @param { string } input.firstName FirstName for the Test
* @param { string } input.lastName LastName for the Test
       *
       * @returns {CreateMethods<Test>} return new document.
       * 
       * @example
       * query.Test.create({  
 * firstName: "Value of the firstName"   
 * lastName: "Value of the lastName"   
       * }).exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-create#signature See more...}
       */
    create(input: TestInput): CreateMethods<Test>;

      /**
       * byId method get a Test document by its document ID.
       * This will returns available Fqlx byId methods
       * 
       * @param {string} id - The ID of the document to retrieve
       * 
       * @returns {ByIdMethods<Test, TestInput>} return document when it exists and is accessible, else return
       * null when the document does not exist or is inaccessible.
       * 
       * @example
       * query.Test.byId("21545645646554").exec()
       * 
       * @see {@link https://fqlx-beta--fauna-docs.netlify.app/fqlx/beta/reference/schema_entities/collection/instance-byid#signature See more...}
       */
       byId(id: string): ByIdMethods<Test, TestInput>
    }


  export interface Query {
    /**
 * @returns This return fqlx methods for the Order 
 */ 
Order: PaginateData<Order> & OrderMethods;
/**
 * @returns This return fqlx methods for the Address 
 */ 
 Address:  PaginateData<Address> & AddressMethods;
/**
 * @returns This return fqlx methods for the Product 
 */ 
Product: PaginateData<Product> & ProductMethods;
/**
 * @returns This return fqlx methods for the Test 
 */ 
Test: PaginateData<Test> & TestMethods;

  }