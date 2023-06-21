import { callFqlxQuery } from '../../../client';
import { NETWORK_ERROR } from '../../../error';
import {
  BasePaginateMethod,
  PaginateData,
} from '../../../interfaces/topLevelTypedefs';
import { ZustandState } from '../../../zustand/interface';
import zustandStore from '../../../zustand/store';

export default function paginate<T>(cursor: string): BasePaginateMethod<T> {
  const executor = async (): Promise<PaginateData<T>> => {
    const store = zustandStore.getStore();
    const query = `Set.paginate(${cursor})`;

    // Checking, query is already executed
    if (store.getState().activeQuery[query]) {
      // Return data from state
      return (store.getState().activeQuery[query] as unknown) as PaginateData<
        T
      >;
    }

    try {
      // Calling Fqlx API
      const res = await callFqlxQuery(query);

      store.setState({
        activeQuery: {
          ...store.getState().activeQuery,
          [query]: res || {},
        },
      } as ZustandState);

      return res;
    } catch (err) {
      // @ts-expect-error
      if (!err?.message?.includes(NETWORK_ERROR)) {
        // Reset fetchingPromise in state
        store.setState(({
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

      throw new Error(JSON.stringify(err));
    }
  };

  return {
    exec: executor,
  };
}
