'use client';

import React, { useEffect } from 'react';
import { configState, useConfigStore } from './configStore';

export const FqlxProvider = ({
  config,
  children,
}: // loader,
{
  config: { fqlxSecret: string };
  // loader: React.ReactElement;
  children: React.ReactElement;
}) => {
  const { setFqlxSecret, fqlxSecret } = useConfigStore(
    (state: configState) => state
  );
  console.log('config===========', config.fqlxSecret);

  useEffect(() => {
    console.log('============in useEffect');

    if (config.fqlxSecret !== fqlxSecret) {
      console.log('============updating secret');
      setFqlxSecret(config.fqlxSecret);
    }
  }, [config]);

  if (!config.fqlxSecret) {
    console.log('============missing secret');
    throw new Error('Missing Fauna Secret');
  }

  // if (!fqlxSecret) {
  //   console.log('============loading');
  //   return <div>Loading...</div>;
  // }

  console.log('secret in store========', fqlxSecret);

  return <div>{!fqlxSecret ? 'Loading...' : children}</div>;
};
