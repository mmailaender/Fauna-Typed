import { callFqlxQuery } from '../../../client';
import { NETWORK_ERROR } from '../../../error';
import { BaseCountMethod } from '../../../interfaces/topLevelTypedefs';
import { ZustandState } from '../../../zustand/interface';
import zustandStore from '../../../zustand/store';

export default function count<T>(
  collectionName: string,
  query: string
): BaseCountMethod<T> {
  // @ts-expect-error
  const executor = (): T => {
    const store = zustandStore.getStore();

    // Checking, query is already executed
    if (store.getState().activeQuery[query]) {
      // Return data from state
      return store.getState().activeQuery[query] as T;
    }

    // Calling Fqlx API
    const req = callFqlxQuery(query);

    let error = '';
    let status = 'pending';

    req
      .then((res: { [key: string]: any }) => {
        status = 'success';
        // Storing API res in local state
        store.setState({
          // [collectionName]: res || {},
          activeQuery: {
            ...store.getState().activeQuery,
            [query]: res || {},
          },
        } as ZustandState);

        return (res || {}) as T;
      })
      .catch((err: { message: string }) => {
        status = 'error';
        error = err?.message;

        if (!err?.message?.includes(NETWORK_ERROR)) {
          store.setState(({
            // [collectionName]: {},
            activeQuery: {
              ...store.getState().activeQuery,
              [query]: false,
            },
          } as unknown) as ZustandState);
        }

        store.setState(({
          activeQuery: {
            ...store.getState().activeQuery,
            [query]: {},
          },
        } as unknown) as ZustandState);
      }) as T;

    if (status === 'pending') {
      throw req;
    }

    if (status === 'error') {
      throw new Error(error);
    }

    if (status === 'success') {
      return (store.getState()[collectionName] || {}) as T;
    }
  };

  return {
    exec: executor,
  };
}
