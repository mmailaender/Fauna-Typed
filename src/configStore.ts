'use client';

import { create } from 'zustand';

export interface configState {
  fqlxSecret: string;
  setFqlxSecret(secret: string): void;
}

export const useConfigStore = create<configState>(set => ({
  fqlxSecret: '',
  setFqlxSecret: (secret: string) => set(() => ({ fqlxSecret: secret })),
}));
