'use client';

import {
  AllMethods,
  FirstMethods,
  PaginateData,
  WhereMethods,
  FirstWhereMethods,
  OrderMethods,
  OrderMethodInput,
} from '../interfaces/topLevelTypedefs';
import zustandStore from '../zustand/store';
import { StateKeys, ZustandState } from '../zustand/interface';
import { callFqlxQuery } from '../client';

export class AllActions<T> {
  protected collectionName: StateKeys;
  private store = zustandStore.getStore();
  private whereQuery = '';

  constructor(collectionName: StateKeys) {
    this.collectionName = collectionName;
  }

  // This Creates query for Fqlx `all()` and returns methods for the same
  public all = (): AllMethods<T> => {
    const query = `${this.collectionName}.all()`;

    const executor = (): PaginateData<T> => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return this.store.getState()[this.collectionName] as PaginateData<T>;
      }

      // Add query as active in state
      this.store.setState({
        activeQuery: { ...this.store.getState().activeQuery, [query]: true },
      } as ZustandState);

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      req
        .then(res => {
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: {
              data: res?.data,
              after: res?.after,
              before: res?.before,
            },
            fetchingPromise: {},
          } as ZustandState);
        })
        .catch(error => {
          // Update value of query as inactive in state
          this.store.setState(({
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: false,
            },
            [this.collectionName]: {
              data: [],
              after: null,
              before: null,
            },
            fetchingPromise: {},
          } as unknown) as ZustandState);

          throw error;
        });

      return this.store.getState()[this.collectionName] as PaginateData<T>;
    };

    return {
      exec: executor,
      first: this.first,
      firstWhere: this.firstWhere,
      where: this.where,
    };
  };

  // This Creates query for Fqlx `all().first()` and returns returns methods for the same
  public first = (): FirstMethods<T> => {
    const query = `${this.collectionName}.all().first()`;

    const executor = (): T => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return ((this.store.getState()[this.collectionName]?.data?.[0] ||
          {}) as unknown) as T;
      }

      // Add query as active in state
      this.store.setState({
        activeQuery: { ...this.store.getState().activeQuery, [query]: true },
      } as ZustandState);

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      req
        .then(res => {
          if (res) {
            // Storing API res in local state
            this.store.setState({
              [this.collectionName]: {
                data: res ? [res] : [],
              },
              fetchingPromise: {},
            } as ZustandState);
          }
        })
        .catch(error => {
          // Reset fetchingPromise in state
          this.store.setState(({
            [this.collectionName]: {
              data: [],
            },
            fetchingPromise: {},
          } as unknown) as ZustandState);

          throw error;
        });

      return ((this.store.getState()[this.collectionName]?.data[0] ||
        {}) as unknown) as T;
    };

    return {
      exec: executor,
    };
  };

  // This Creates query for Fqlx `all().where()` and returns methods for the same
  public where = (input: ((data: T) => boolean) | string): WhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;
    const query = `${this.collectionName}.all().where(${condition})`;
    this.whereQuery = input.toString();

    const executor = (): PaginateData<T> => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return this.store.getState()[this.collectionName] as PaginateData<T>;
      }

      // Add query as active in state
      this.store.setState({
        activeQuery: { ...this.store.getState().activeQuery, [query]: true },
      } as ZustandState);

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      req
        .then(res => {
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: {
              data: res?.data,
              after: res?.after,
              before: res?.before,
            },
            fetchingPromise: {},
          } as ZustandState);
        })
        .catch(error => {
          // Reset fetchingPromise in state
          this.store.setState(({
            [this.collectionName]: {
              data: [],
              after: null,
              before: null,
            },
            fetchingPromise: {},
          } as unknown) as ZustandState);

          throw error;
        });

      return this.store.getState()[this.collectionName] as PaginateData<T>;
    };

    return {
      exec: executor,
      order: this.order,
    };
  };

  // This Creates query for Fqlx `all().firstWhere()` and returns methods for the same
  public firstWhere = (
    input: ((data: T) => boolean) | string
  ): FirstWhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;

    const query = `${this.collectionName}.all().firstWhere(${condition})`;

    const executor = (): T => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return this.store.getState()[this.collectionName] as T;
      }

      // Add query as active in state
      this.store.setState({
        activeQuery: { ...this.store.getState().activeQuery, [query]: true },
      } as ZustandState);

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      req
        .then(res => {
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: {
              data: res ? [res] : [],
              after: null,
              before: null,
            },
            fetchingPromise: {},
          } as ZustandState);
        })
        .catch(error => {
          // Reset fetchingPromise in state
          this.store.setState(({
            [this.collectionName]: {
              data: [],
              after: null,
              before: null,
            },
            fetchingPromise: {},
          } as unknown) as ZustandState);

          throw error;
        });

      return (this.store.getState()[this.collectionName]?.data[0] || {}) as T;
    };

    return {
      exec: executor,
    };
  };

  public order = (orderInput: OrderMethodInput<T>): OrderMethods<T> => {
    const query = `${this.collectionName}.all().where(${this.whereQuery}).order(${orderInput}`;

    const executor = (): PaginateData<T> => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return this.store.getState()[this.collectionName] as PaginateData<T>;
      }

      // Add query as active in state
      this.store.setState({
        activeQuery: { ...this.store.getState().activeQuery, [query]: true },
      } as ZustandState);

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      req
        .then(res => {
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: {
              data: res?.data,
              after: res?.after,
              before: res?.before,
            },
            fetchingPromise: {},
          } as ZustandState);
        })
        .catch(error => {
          // Reset fetchingPromise in state
          this.store.setState(({
            [this.collectionName]: {
              data: [],
              after: null,
              before: null,
            },
            fetchingPromise: {},
          } as unknown) as ZustandState);

          throw error;
        });

      return this.store.getState()[this.collectionName] as PaginateData<T>;
    };

    return {
      exec: executor,
    };
  };
}
