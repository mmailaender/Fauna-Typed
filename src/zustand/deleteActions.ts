'use client';

import { StateKeys, ZustandSetAction, ZustandState } from './interface';
import { revalidateActiveQueries } from './revalidateActiveQueries';

export const handleDeleteDocument = (
  set: ZustandSetAction,
  id: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    let deletedItem = {};

    const remainingItems = state[collection]?.data?.filter(
      (data: any, index) => {
        if (data.id == id) {
          deletedItem = { ...data, dataIndex: index };
          return false;
        }
        return true;
      }
    );

    return ({
      temp: [...(state?.temp || {}), deletedItem],
      [collection]: { data: remainingItems },
    } as unknown) as ZustandState;
  });
};

export const handleDeleteDocumentSuccess = (
  set: ZustandSetAction,
  id: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    const filteredTemp = state.temp.filter(t => t.id !== id);

    revalidateActiveQueries(collection);

    return {
      temp: filteredTemp,
    } as ZustandState;
  });
};

export const handleDeleteDocumentError = (
  set: ZustandSetAction,
  id: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    const deletedItem = state.temp.find((data: any) => data.id === id);

    if (!deletedItem) {
      return state as ZustandState;
    }

    const index = deletedItem.dataIndex;
    let updatedCollection: { [key: string]: any }[] = [];
    if (collection in state) {
      updatedCollection = [...(state[collection]?.data || [])];
      updatedCollection.splice(index, 0, deletedItem);
    }

    revalidateActiveQueries(collection);

    return ({
      temp: state.temp.filter((data: any) => data.id !== id),
      [collection]: { data: updatedCollection },
    } as unknown) as ZustandState;
  });
};
