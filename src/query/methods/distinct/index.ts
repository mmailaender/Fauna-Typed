import { BaseDistinctMethod } from '../../../interfaces/topLevelTypedefs';
import { executor } from '../../executor';

export default function distinct<T>(
  _collectionName: string,
  query: string
): BaseDistinctMethod<T> {
  const distinctQuery = `${query}.distinct()`;

  return {
    exec: () => executor(distinctQuery),
  };
}
