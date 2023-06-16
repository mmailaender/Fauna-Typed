'use client';

import { StateKeys, ZustandSetAction, ZustandState } from './interface';
import { resetActiveQueriesByCollection } from './resetActiveQueryByCollection';

export const handleCreateDocument = <T>(
  set: ZustandSetAction,
  inputData: T,
  collection: StateKeys
) => {
  set((state: ZustandState) => {

    return {
      [collection]: {
        data: [...(state[collection]?.data || []), inputData],
      },
    } as ZustandState;
  });
};

export const handleCreateDocumentSuccess = (
  set: ZustandSetAction,
  id: string,
  resId: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    const validData = state[collection]?.data?.map((obj: any) => {
      if (obj.id === id) {
        obj.id = resId;
      }
      return obj;
    });

    resetActiveQueriesByCollection(collection);

    return {
      [collection]: { data: validData },
    } as ZustandState;
  });
};

export const handleCreateDocumentFailed = (
  set: ZustandSetAction,
  id: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    const validStates = state[collection]?.data?.filter(
      (obj: any) => obj.id !== id
    );

    resetActiveQueriesByCollection(collection);

    return {
      [collection]: {
        data: validStates,
      },
    } as ZustandState;
  });
};
