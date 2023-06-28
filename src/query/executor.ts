import { callFqlxQuery } from '../client';
import { NETWORK_ERROR } from '../error';
import { ZustandState } from '../zustand/interface';
import zustandStore from '../zustand/store';

export const executor = <T>(query: string): T => {
  const store = zustandStore.getStore();

  // Checking, query is already executed
  if (store.getState().activeQuery[query]) {
    // Return data from state
    return store.getState().activeQuery[query] as T;
  }

  // Calling Fqlx API
  const req = callFqlxQuery(query);

  let result = '';
  let status = 'pending';

  req
    .then(res => {
      status = 'success';
      result = res;

      // Storing API res in local state
      store.setState({
        activeQuery: {
          ...store.getState().activeQuery,
          [query]: res,
        },
      } as ZustandState);
    })
    .catch(err => {
      status = 'error';
      result = err?.message;

      if (!err?.message?.includes(NETWORK_ERROR)) {
        // Update value of query as inactive in state
        store.setState({
          activeQuery: {
            ...store.getState().activeQuery,
            [query]: false,
          },
        } as ZustandState);

        return;
      }

      store.setState({
        activeQuery: {
          ...store.getState().activeQuery,
          [query]: { data: [] },
        },
      } as ZustandState);
    });

  if (status === 'pending') {
    throw req as T;
  }

  if (status === 'error') {
    throw new Error(result) as T;
  }

  return result as T;
};
