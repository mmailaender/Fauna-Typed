'use client';

import { StateKeys, ZustandSetAction, ZustandState } from './interface';
import { resetActiveQueriesByCollection } from './resetActiveQueryByCollection';

export const handleUpdateDocument = <T>(
  set: ZustandSetAction,
  id: string,
  inputData: T,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    let currentData = {};
    const updatedState = state[collection]?.data?.map?.(data => {
      if (data?.id === id) {
        currentData = data;
        return { ...data, ...inputData };
      } else {
        return data;
      }
    });

    return ({
      temp: [...(state.temp || {}), currentData],
      [collection]: { data: updatedState },
    } as unknown) as ZustandState;
  });
};

export const handleUpdateDocumentSuccess = (
  set: ZustandSetAction,
  id: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    const filteredTemp = state.temp.filter(t => t.id !== id);

    resetActiveQueriesByCollection(collection);

    return {
      temp: filteredTemp,
    } as ZustandState;
  });
};

export const handleUpdateDocumentError = (
  set: ZustandSetAction,
  id: string,
  collection: StateKeys
) => {
  set((state: ZustandState) => {
    const validStates = state[collection]?.data?.map((data: any) => {
      if (data.id === id) {
        return { ...state.temp.find(t => t?.id === id) };
      } else {
        return data;
      }
    });

    const filteredTemp = state.temp.filter(t => t?.id !== id);

    resetActiveQueriesByCollection(collection);

    return ({
      temp: filteredTemp,
      [collection]: { data: validStates },
    } as unknown) as ZustandState;
  });
};
