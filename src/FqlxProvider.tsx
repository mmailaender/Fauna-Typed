'use client';

import React, { useEffect } from 'react';
import { configState, useConfigStore } from './configStore';

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

  useEffect(() => {
    console.log({ newSecret: config.fqlxSecret });
    setFqlxSecret(config.fqlxSecret);
  }, [config.fqlxSecret]);

  useEffect(() => {
    if (config?.endpoint && config?.endpoint !== fqlxEndpoint) {
      setFqlxEndpoint(config.endpoint);
    }
  }, [config.endpoint]);

  if (!config.fqlxSecret) {
    throw new Error('Missing Fauna Secret');
  }

  return !fqlxSecret ? loader : children;
};
