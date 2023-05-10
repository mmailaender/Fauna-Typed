'use client';

import React, { useEffect } from 'react';
import { configState, useConfigStore } from './configStore';

export const FqlxProvider = ({
  config,
  children,
  loader,
}: {
  config: { fqlxSecret: string };
  loader: React.ReactElement;
  children: React.ReactElement;
}) => {
  const { setFqlxSecret, fqlxSecret } = useConfigStore(
    (state: configState) => state
  );
  console.log('config===========', config.fqlxSecret);

  useEffect(() => {
    if (config.fqlxSecret && config.fqlxSecret !== fqlxSecret) {
      setFqlxSecret(config.fqlxSecret);
    }
  }, []);

  if (!config.fqlxSecret) {
    throw new Error('Missing Fauna Secret');
  }

  console.log('secret in store========', fqlxSecret);

  return !fqlxSecret ? loader : children;
};
