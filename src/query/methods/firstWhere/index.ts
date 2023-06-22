import { callFqlxQuery } from '../../../client';
import { NETWORK_ERROR } from '../../../error';
import { FirstWhereMethods } from '../../../interfaces/topLevelTypedefs';
import { ZustandState } from '../../../zustand/interface';
import zustandStore from '../../../zustand/store';
import projection from '../projection';

export default function firstWhere<T>(
  collectionName: string,
  query: string
): FirstWhereMethods<T> {
  const store = zustandStore.getStore();

  // @ts-expect-error
  const executor = (): T => {
    //     // Checking, query is already executed
    if (store.getState().activeQuery[query]) {
      // Return data from state
      return store.getState().activeQuery[query] as T;
    }

    // Calling Fqlx API
    const req = callFqlxQuery(query);

    // Updating fetchingPromise in state
    // store.setState({
    //   fetchingPromise: { current: req },
    // } as ZustandState);

    let error = '';
    let status = 'pending';

    req
      .then(res => {
        status = 'success';
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

        return (store.getState()[collectionName]?.data[0] || {}) as T;
      })
      .catch(err => {
        status = 'error';
        error = err?.message;

        if (!err?.message?.includes(NETWORK_ERROR)) {
          // Reset fetchingPromise in state
          store.setState(({
            [collectionName]: {
              data: [],
              after: null,
              before: null,
            },
            activeQuery: {
              ...store.getState().activeQuery,
              [query]: false,
            },
          } as unknown) as ZustandState);
        }

        store.setState(({
          fetchingPromise: {},
          activeQuery: {
            ...store.getState().activeQuery,
            [query]: {},
          },
        } as unknown) as ZustandState);
      }) as T;

    if (status === 'pending') {
      throw req as T;
    }

    if (status === 'error') {
      throw new Error(error) as T;
    }

    if (status === 'success') {
      return (store.getState()[collectionName]?.data[0] || {}) as T;
    }
  };

  return {
    exec: executor,
    project: projectionFields =>
      projection<T, T>(collectionName, query, projectionFields),
  };
}
