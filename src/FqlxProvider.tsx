'use client';

import React, { useEffect } from 'react';
import { configState, useConfigStore } from './configStore';
import fqlxStore from './zustand/store';
import { ZustandStore } from './zustand/interface';

export const FqlxProvider = ({
  config,
  children,
  loader,
}: {
  config: { fqlxSecret: string; endpoint?: URL };
  loader: React.ReactElement;
  children: React.ReactElement;
}) => {
  const {
    setFqlxSecret,
    fqlxSecret,
    setFqlxEndpoint,
    fqlxEndpoint,
  } = useConfigStore((state: configState) => state);
  const useFqlxStore: ZustandStore = fqlxStore.getStore();
  const fqlxState = useFqlxStore(state => state);

  useEffect(() => {
    setFqlxSecret(config.fqlxSecret);
  }, [config.fqlxSecret]);

  useEffect(() => {
    if (config?.endpoint && config?.endpoint !== fqlxEndpoint) {
      setFqlxEndpoint(config.endpoint);
    }
  }, [config.endpoint]);

  // Reset active query
  useEffect(() => {
    fqlxState.resetActiveQuery();
  }, []);

  if (!config.fqlxSecret) {
    throw new Error('Missing Fauna Secret');
  }

  return !fqlxSecret ? loader : children;
};
