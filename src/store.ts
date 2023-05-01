import { create } from 'zustand';

export interface FqlxState {
  fqlxSecret: string;
  setFqlxSecret(secret: string): void;
}

// type Store = UseBoundStore<StoreApi<FqlxState>>;

export const useFqlxStore = create<FqlxState>(set => ({
  fqlxSecret: '',
  setFqlxSecret: (secret: string) => set(() => ({ fqlxSecret: secret })),
}));
