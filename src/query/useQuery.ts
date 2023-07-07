'use client';

import { useMemo } from 'react';
import zustandStore from '../zustand/store';
import { StateKeys, ZustandStore } from '../zustand/interface';
import { AllActions } from './AllActions';
import { CreateActions } from './CreateActions';
import { ByIdActions } from './ByIdActions';
import { FirstWhereActions } from './FirstWhereActions';
import { SetActions } from './SetActions';

export const useQuery = <T>(): T => {
  const useStore: ZustandStore = zustandStore.getStore();
  const storeStates = useStore(state => state);

  const createStateInStore = (collectionName: StateKeys) => {
    if (!storeStates[collectionName]?.data) {
      storeStates[collectionName] = { data: [] };
    }
  };

  return useMemo(
    () =>
      new Proxy(storeStates, {
        get(_target: { [key: string]: any }, collectionName: string) {
          switch (collectionName) {
            case 'Set':
              return new SetActions().set();

            default:
              createStateInStore(collectionName);
              return new Proxy(
                {},
                {
                  get(
                    _lvlOneTarget: { [key: string]: any },
                    lvlOneKey: string
                  ) {
                    switch (lvlOneKey) {
                      case 'all':
                        return new AllActions(collectionName).all;
                      case 'create':
                        return new CreateActions(collectionName).create;
                      case 'byId':
                        return new ByIdActions(collectionName).byId;
                      case 'firstWhere':
                        return new FirstWhereActions(collectionName).firstWhere;
                      default:
                        return {};
                    }
                  },
                }
              );
          }
        },
      }) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storeStates]
  );
};
