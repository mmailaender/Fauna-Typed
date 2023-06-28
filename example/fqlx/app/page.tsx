'use client';

import { Query } from '@/fqlx-generated/typedefs';
import { useQuery } from 'fqlx-client';

export default function Home() {
  const query = useQuery<Query>();

  const implants = query.Product.all().where(p => p.implant != null).exec();

  console.log({ implants });

  return <div>ksjhdkjsdh</div>;
}
