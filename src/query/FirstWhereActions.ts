'use client';

import { FirstWhereMethods } from '../interfaces/topLevelTypedefs';
import zustandStore from '../zustand/store';
import { StateKeys, ZustandState } from '../zustand/interface';
import { callFqlxQuery } from '../client';

export class FirstWhereActions<T> {
  protected collectionName: StateKeys;
  private store = zustandStore.getStore();

  constructor(collectionName: StateKeys) {
    this.collectionName = collectionName;
  }

  // This Creates query for Fqlx `firstWhere()` and returns methods for the same
  public firstWhere = (
    input: ((data: T) => boolean) | string
  ): FirstWhereMethods<T> => {
    const condition = typeof input === 'function' ? input.toString() : input;

    const query = `${this.collectionName}.firstWhere(${condition})`;

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
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: res || {},
            },
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
            activeQuery: {
              ...this.store.getState().activeQuery,
              [query]: false,
            },
          } as unknown) as ZustandState);

          throw error;
        });

      return (this.store.getState()[this.collectionName]?.data[0] || {}) as T;
    };

    return {
      exec: executor,
    };
  };
}
