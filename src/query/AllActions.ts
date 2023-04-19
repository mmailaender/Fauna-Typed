import {
  AllMethods,
  FirstMethods,
  PaginateData,
  WhereMethods,
} from '../interfaces/topLevelTypedefs';
import zustandStore from '../zustand/store';
import { StateKeys, ZustandState } from '../zustand/interface';
import { callFqlxQuery } from '../client';

export class AllActions<T> {
  protected collectionName: StateKeys;
  private store = zustandStore.getStore();

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
          this.store.setState({
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: false,
            },
          } as ZustandState);
          // Reset fetchingPromise in state
          this.store.setState({ fetchingPromise: {} } as ZustandState);

          throw error;
        });

      return this.store.getState()[this.collectionName] as PaginateData<T>;
    };

    return {
      exec: executor,
      first: this.first,
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
            });
          }
          // Reset fetchingPromise in state
          this.store.setState({ fetchingPromise: {} } as ZustandState);
        })
        .catch(error => {
          // Reset fetchingPromise in state
          this.store.setState({ fetchingPromise: {} } as ZustandState);

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
  public where = (input: (data: T) => boolean): WhereMethods<T> => {
    const query = `${this.collectionName}.all().where(${input.toString()})`;

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
          this.store.setState({ fetchingPromise: {} } as ZustandState);

          throw error;
        });

      return this.store.getState()[this.collectionName] as PaginateData<T>;
    };

    return {
      exec: executor,
    };
  };
}
