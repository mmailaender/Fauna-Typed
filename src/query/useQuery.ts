import { useMemo } from 'react';
import { Query } from '../generated/typedefs';
import zustandStore from '../zustand/store';
import { StateKeys, ZustandStore } from '../zustand/interface';
import { AllActions } from './AllActions';
import { CreateActions } from './CreateActions';
import { ByIdActions } from './ByIdActions';

type UseQueryReturnType = Query;

export const useQuery = (): UseQueryReturnType => {
  const useStore: ZustandStore = zustandStore.getStore();
  const storeStates = useStore((state) => state);

  if (storeStates.fetchingPromise?.current) {
    throw storeStates.fetchingPromise?.current;
  }

  const createStateInStore = (collectionName: StateKeys) => {
    if (!storeStates[collectionName]?.data) {
      storeStates[collectionName] = { data: [] };
    }
  };

  return useMemo(
    () =>
      new Proxy(storeStates, {
        get(_target: { [key: string]: any }, collectionName: StateKeys) {
          createStateInStore(collectionName);
          return new Proxy(
            {},
            {
              get(_lvlOneTarget: { [key: string]: any }, lvlOneKey: string) {
                switch (lvlOneKey) {
                  case 'all':
                    return new AllActions(collectionName).all;
                  case 'create':
                    return new CreateActions(collectionName).create;
                  case 'byId':
                    return new ByIdActions(collectionName).byId;
                  default:
                    return {};
                }
              },
            }
          );
        },
      }) as UseQueryReturnType,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storeStates]
  );
};
