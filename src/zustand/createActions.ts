import { StateKeys, ZustandSetAction, ZustandState } from './interface';

export const handleCreateDocument = <T>(
  set: ZustandSetAction,
  inputData: T,
  collection: StateKeys
) => {
  console.log('inside createAddAction ', collection, inputData);
  set((state: ZustandState) => ({
    [collection]: {
      data: [inputData, ...(state[collection]?.data || [])],
    },
  }) as ZustandState);
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
    return {
      [collection]: {
        data: validStates,
      },
    } as ZustandState;
  });
};
