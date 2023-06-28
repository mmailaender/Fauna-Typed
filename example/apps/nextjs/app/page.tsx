'use client';

import { Query } from '@/fqlx-generated/typedefs';
import { useQuery } from 'fqlx-client';

export default function Home() {
  const query = useQuery<Query>();

  return <div>Fqlx Next.JS Example</div>;
}
