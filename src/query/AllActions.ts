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
import firstWhereMethod from './methods/firstWhere';
import { NETWORK_ERROR } from '../error';

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

    // @ts-expect-error
    const executor = (): PaginateData<T> => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return (this.store.getState().activeQuery[
          query
        ] as unknown) as PaginateData<T>;
      }

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      let error = '';
      let status = 'pending';

      req
        .then(res => {
          status = 'success';

          const resData = {
            data: res?.data,
            after: res?.after,
            before: res?.before,
          };
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: resData,
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: resData,
            },
          } as ZustandState);
        })
        .catch(err => {
          status = 'error';
          error = err?.message;

          if (!err?.message?.includes(NETWORK_ERROR)) {
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
            } as unknown) as ZustandState);

            error = err;
          }

          this.store.setState(({
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: { data: [] },
            },
          } as unknown) as ZustandState);
        });

      if (status === 'pending') {
        throw req as T;
      }

      if (status === 'error') {
        throw new Error(error) as T;
      }

      if (status === 'success') {
        return this.store.getState()[this.collectionName] as PaginateData<T>;
      }
    };

    return {
      exec: executor,
      first: this.first(query),
      firstWhere: this.firstWhere,
      where: this.where,
      order: this.order,
    };
  };

  // This Creates query for Fqlx `all().first()` and returns returns methods for the same
  public first = (queryPrefix: string) => (): FirstMethods<T> => {
    const query = `${queryPrefix}.first()`;

    // @ts-expect-error
    const executor = (): T => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return this.store.getState().activeQuery[query] as T;
      }

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      let error = '';
      let status = 'pending';

      req
        .then(res => {
          status = 'success';
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: {
              data: res ? [res] : [],
            },
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: res || {},
            },
          } as ZustandState);
        })
        .catch(err => {
          status = 'error';
          error = err?.message;

          if (!err?.message?.includes(NETWORK_ERROR)) {
            // Reset fetchingPromise in state
            this.store.setState(({
              [this.collectionName]: {
                data: [],
              },
              activeQuery: {
                ...this.store.getState().activeQuery,
                [query]: false,
              },
            } as unknown) as ZustandState);
          }

          this.store.setState(({
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: {},
            },
          } as unknown) as ZustandState);
        });

      if (status === 'pending') {
        throw req as T;
      }

      if (status === 'error') {
        throw new Error(error) as T;
      }

      if (status === 'success') {
        return ((this.store.getState()[this.collectionName]?.data[0] ||
          {}) as unknown) as T;
      }
    };

    return {
      exec: executor,
    };
  };

  // This Creates query for Fqlx `all().where()` and returns methods for the same
  public where = (input: ((data: T) => boolean) | string): WhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;
    const query = `${this.collectionName}.all().where(${condition})`;
    this.whereQuery = condition;

    // @ts-expect-error
    const executor = (): PaginateData<T> => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return (this.store.getState().activeQuery[
          query
        ] as unknown) as PaginateData<T>;
      }

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      let error = '';
      let status = 'pending';

      req
        .then(res => {
          status = 'success';

          const resData = {
            data: res?.data,
            after: res?.after,
            before: res?.before,
          };
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: resData,
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: resData,
            },
          } as ZustandState);
        })
        .catch(err => {
          status = 'error';
          error = err?.message;

          if (!err?.message?.includes(NETWORK_ERROR)) {
            // Reset fetchingPromise in state
            this.store.setState(({
              [this.collectionName]: {
                data: [],
                after: null,
                before: null,
              },
              fetchingPromise: {},
              activeQuery: {
                ...this.store.getState().activeQuery,
                [query]: false,
              },
            } as unknown) as ZustandState);
          }

          this.store.setState(({
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: { data: [] },
            },
          } as unknown) as ZustandState);
        });

      if (status === 'pending') {
        throw req as T;
      }

      if (status === 'error') {
        throw new Error(error) as T;
      }

      if (status === 'success') {
        return this.store.getState()[this.collectionName] as PaginateData<T>;
      }
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

    return firstWhereMethod(this.collectionName as string, query);
  };

  public order = (orderInput: OrderMethodInput<T>): OrderMethods<T> => {
    const query = this.whereQuery
      ? `${this.collectionName}.all().where(${this.whereQuery}).order(${orderInput})`
      : `${this.collectionName}.all().order(${orderInput})`;

    // @ts-expect-error
    const executor = (): PaginateData<T> => {
      // Checking, query is already executed
      if (this.store.getState().activeQuery[query]) {
        // Return data from state
        return (this.store.getState().activeQuery[
          query
        ] as unknown) as PaginateData<T>;
      }

      // Calling Fqlx API
      const req = callFqlxQuery(query);

      // Updating fetchingPromise in state
      this.store.setState({
        fetchingPromise: { current: req },
      } as ZustandState);

      let error = '';
      let status = 'pending';

      req
        .then(res => {
          status = 'success';

          const resData = {
            data: res?.data,
            after: res?.after,
            before: res?.before,
          };
          // Storing API res in local state
          this.store.setState({
            [this.collectionName]: resData,
            fetchingPromise: {},
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: resData,
            },
          } as ZustandState);
        })
        .catch(err => {
          status = 'error';
          error = err?.message;

          if (!err?.message?.includes(NETWORK_ERROR)) {
            // Reset fetchingPromise in state
            this.store.setState(({
              [this.collectionName]: {
                data: [],
                after: null,
                before: null,
              },
              activeQuery: {
                ...this.store.getState().activeQuery,
                [query]: false,
              },
            } as unknown) as ZustandState);

            this.store.setState(({
              fetchingPromise: {},
              activeQuery: {
                ...this.store.getState().activeQuery,
                [query]: {},
              },
            } as unknown) as ZustandState);
          }
        });

      if (status === 'pending') {
        throw req as T;
      }

      if (status === 'error') {
        throw new Error(error) as T;
      }

      if (status === 'success') {
        return this.store.getState()[this.collectionName] as PaginateData<T>;
      }
    };

    return {
      exec: executor,
      first: this.first(query),
    };
  };
}
