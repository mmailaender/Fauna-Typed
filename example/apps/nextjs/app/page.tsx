'use client';

import { Query } from '@/fqlx-generated/typedefs';
import { useQuery } from 'fauna-typed';

export default function Home() {
  const query = useQuery<Query>();

  const block = query.Block.all()
    .where(a => a.id == '20230627170316817')
    .exec();

  console.log({ block });

  return <div>Fqlx Next.JS Example</div>;
}
