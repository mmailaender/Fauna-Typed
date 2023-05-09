'use client';

import React, { useEffect } from 'react';
import { configState, useConfigStore } from './configStore';

export const FqlxProvider = ({
  config,
}: // loader,
// children,
{
  config: { fqlxSecret: string };
  // loader: React.ReactElement;
  // children: React.ReactElement;
}) => {
  const { setFqlxSecret, fqlxSecret } = useConfigStore(
    (state: configState) => state
  );
  console.log('config===========', config.fqlxSecret);

  if (!config.fqlxSecret) {
    console.log('============missing secret');
    throw new Error('Missing Fauna Secret');
  }

  if (!fqlxSecret) {
    console.log('============loading');
    return <div>Loading...</div>;
  }

  useEffect(() => {
    console.log('============in useEffect');

    if (config.fqlxSecret !== fqlxSecret) {
      console.log('============updating secret');
      setFqlxSecret(config.fqlxSecret);
    }
  }, [config.fqlxSecret]);

  console.log('secret in store========', fqlxSecret);

  return <div>Hello</div>;
  // return children;
};
