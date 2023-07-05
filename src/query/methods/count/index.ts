import { BaseCountMethod } from '../../../interfaces/topLevelTypedefs';
import { executor } from '../../executor';

export default function count<T>(
  _collectionName: string,
  query: string
): BaseCountMethod<T> {
  const countQuery = `${query}.count()`;

  return {
    exec: () => executor(countQuery),
  };
}
