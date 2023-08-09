import { callFqlxQuery } from '../client';
import { NETWORK_ERROR } from '../error';
import { ZustandState } from '../zustand/interface';
import zustandStore from '../zustand/store';

export const executor = <T>(query: string): T => {
  const store = zustandStore.getStore();

  const activeQueryValue = store.getState().activeQuery[query];
  // Checking, query is already executed
  if (!isNaN(activeQueryValue) || activeQueryValue) {
    if (activeQueryValue instanceof Promise) {
      let queryStatus = 'pending';
      let queryResult = null;

      activeQueryValue
        .then(data => {
          queryStatus = 'success';
          queryResult = data;

          store.setState({
            activeQuery: {
              ...store.getState().activeQuery,
              [query]: data,
            },
          } as ZustandState);
        })
        .catch(err => {
          queryStatus = 'error';

          store.setState({
            activeQuery: {
              ...store.getState().activeQuery,
              [query]: false,
            },
          } as ZustandState);

          throw new Error(`Error from cahce promise: Error: ${err}`);
        });

      if (queryStatus === 'pending') {
        throw activeQueryValue;
      }

      if (queryStatus === 'success') {
        return queryResult as T;
      }
    }

    // Return data from state
    return activeQueryValue as T;
  }

  // Calling Fqlx API
  const req = callFqlxQuery(query);

  store.setState({
    activeQuery: {
      ...store.getState().activeQuery,
      [query]: req,
    },
  } as ZustandState);

  let result = '';
  let status = 'pending';

  req
    .then(res => {
      status = 'success';
      result = res as string;

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

export const promisedExecutor = async <T>(query: string): Promise<T> => {
  try {
    // Calling Fqlx API
    const res: any = await callFqlxQuery(query);

    return res;
  } catch (err) {

    throw new Error(JSON.stringify(err));
  }
};
