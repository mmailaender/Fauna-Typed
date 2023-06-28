import { BaseMapMethod } from '../../../interfaces/topLevelTypedefs';
import distinct from '../distinct';
import { executor } from '../../executor';

export default function map<T>(
  collectionName: string,
  query: string,
  callbackFn: string | ((data: T) => string | number | boolean | Partial<T>)
): BaseMapMethod<T> {
  const mapQuery = `${query}.map(${callbackFn.toString()})`;

  return {
    exec: () => executor(mapQuery),
    distinct: () => distinct(collectionName, mapQuery),
  };
}
