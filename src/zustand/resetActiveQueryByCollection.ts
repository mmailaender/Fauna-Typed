import { StateKeys, ZustandState } from './interface';
import zustandStore from './store';

export const resetActiveQueriesByCollection = (collection: StateKeys) => {
  const store = zustandStore.getStore();
  const states = store.getState();

  const { activeQuery } = states;
  const activeQueryClone = { ...activeQuery };

  const activeQueriesKeys = Object.keys(activeQueryClone);

  activeQueriesKeys.forEach(activeQueryKey => {
    if (
      activeQueryKey
        ?.toLocaleLowerCase()
        ?.includes(collection?.toString().toLocaleLowerCase())
    ) {
      delete activeQueryClone[activeQueryKey];
    }
  });

  store.setState({
    activeQuery: activeQueryClone,
  } as ZustandState);
};
