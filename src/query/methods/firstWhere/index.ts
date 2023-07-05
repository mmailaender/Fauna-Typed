import { FirstWhereMethods } from '../../../interfaces/topLevelTypedefs';
import { executor } from '../../executor';
import projection from '../projection';

export default function firstWhere<T>(
  collectionName: string,
  query: string
): FirstWhereMethods<T> {
  return {
    exec: () => executor(query),
    project: projectionFields =>
      projection<T, T>(collectionName, query, projectionFields),
  };
}
