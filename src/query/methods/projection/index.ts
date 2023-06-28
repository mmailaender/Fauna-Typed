import {
  ExecMethods,
  ProjectionFieldsInputType,
} from '../../../interfaces/topLevelTypedefs';
import { executor } from '../../executor';

const mapProjectionFields = <T>(
  projectionFields: Partial<ProjectionFieldsInputType<T>>
): string => {
  return Object.entries(projectionFields)
    .map(field => {
      const key = field[0];
      const value = field[1];

      if (typeof value === 'object') {
        if (!Array.isArray(value)) {
          return `${key} { ${mapProjectionFields(
            value as ProjectionFieldsInputType<T>
          )} }`;
        }

        return `${key} { ${mapProjectionFields(
          value[0] as ProjectionFieldsInputType<T>
        )} }`;
      }

      return key;
    })
    .join(', ');
};

export default function projection<T, RES_TYPE>(
  _collectionName: string,
  query: string,
  projectionFields: Partial<ProjectionFieldsInputType<T>>
): ExecMethods<RES_TYPE> {
  const mappedFields = mapProjectionFields(projectionFields);

  const projectionQuery = `${query} { ${mappedFields} }`;

  return {
    exec: () => executor(projectionQuery),
  };
}
