import { callFqlxQuery } from '../../../client';
import { ZustandState } from '../../../zustand/interface';
import zustandStore from '../../../zustand/store';

export default function firstWhere<T>(collectionName: string, query: string) {
  const store = zustandStore.getStore();

  const executor = (): T => {
    //     // Checking, query is already executed
    if (store.getState().activeQuery[query]) {
      // Return data from state
      return store.getState().activeQuery[query] as T;
    }

    // Calling Fqlx API
    const req = callFqlxQuery(query);

    // Updating fetchingPromise in state
    store.setState({
      fetchingPromise: { current: req },
    } as ZustandState);

    req
      .then(res => {
        // Storing API res in local state
        store.setState({
          [collectionName]: {
            data: res ? [res] : [],
            after: null,
            before: null,
          },
          fetchingPromise: {},
          activeQuery: {
            ...store.getState().activeQuery,
            [query]: res || {},
          },
        } as ZustandState);
      })
      .catch(error => {
        if (!error?.message?.includes('NetworkError')) {
          // Reset fetchingPromise in state
          store.setState(({
            [collectionName]: {
              data: [],
              after: null,
              before: null,
            },
            fetchingPromise: {},
            activeQuery: {
              ...store.getState().activeQuery,
              [query]: false,
            },
          } as unknown) as ZustandState);
        }

        throw error;
      });

    return (store.getState()[collectionName]?.data[0] || {}) as T;
  };

  return {
    exec: executor,
  };
}
