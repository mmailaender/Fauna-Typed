import { StoreApi, UseBoundStore } from 'zustand';

export type ZustandStore = UseBoundStore<StoreApi<ZustandState>>;

export type StateKeys = keyof { [key: string]: string };

export type StateValues = {
  data: { [key: string]: any }[];
  after?: string | null;
  before?: string | null;
};

export type InitialState = Record<StateKeys, StateValues>;

export type ZustandState = Partial<InitialState> & {
  temp: { [key: string]: any }[];
  activeQuery: { [key: string]: boolean };
  create: <T>(inputData: T, collection: StateKeys) => void;
  onCreateSuccess: (id: string, resId: string, collection: StateKeys) => void;
  onCreateFailed: (id: string, collection: StateKeys) => void;
  getStateById: <T>(id: string, collection: StateKeys) => T;
  update: <T>(id: string, inputData: T, collection: StateKeys) => void;
  onUpdateSuccess: (id: string, collection: StateKeys) => void;
  onUpdateFailed: (id: string, collection: StateKeys) => void;
  delete: (id: string, collection: StateKeys) => void;
  onDeleteFailed: (id: string, collection: StateKeys) => void;
  onDeleteSuccess: (id: string, collection: StateKeys) => void;
  resetActiveQuery: () => void;
};

export type ZustandSetAction = (
  partial:
    | ZustandState
    | Partial<ZustandState>
    | ((state: ZustandState) => ZustandState | Partial<ZustandState>),
  replace?: boolean | undefined
) => void;
