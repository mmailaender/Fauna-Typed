type Field = { name: string; type: string };

type CollectionsWithFieldsType = {
  name: string;
  fields: Field[];
};

type GetCollectionsWithFieldsArgs = {
  [key: string]: { fields: { [key: string]: any } };
};

const getFields = (fields: { [key: string]: any }): Field[] => {
  return Object.keys(fields).map(fieldKey => {
    const fieldValue = fields[fieldKey as keyof typeof fields];

    if (typeof fieldValue === 'object') {
      return {
        name: fieldKey,
        type: 'object',
        fields: getFields(fieldValue),
      };
    }
    return {
      name: fieldKey,
      type: fieldValue,
    };
  });
};

export const getCollectionsWithFields = (
  schema: GetCollectionsWithFieldsArgs
): CollectionsWithFieldsType[] => {
  const collectionsWithFields: CollectionsWithFieldsType[] = [];

  Object.keys(schema).forEach(collectionName => {
    if (collectionName !== 'Functions') {
      const fields = schema[collectionName as keyof typeof schema].fields;

      collectionsWithFields.push({
        name: collectionName,
        fields: getFields(fields),
      });
    }
  });

  return collectionsWithFields;
};

export const createInitialDataFromFields = (
  data: { name: string; fields: { name: string; type: string }[] }[]
) => {
  const initialData: { [key: string]: any } = {};

  data.forEach(({ name }) => {
    initialData[name] = {};
  });

  data.forEach(({ name: keyName, fields }) => {
    fields.forEach(({ name: fieldName, type: fieldType }) => {
      let val = undefined;
      let arr = false;

      if (fieldType.endsWith('[]')) {
        fieldType = fieldType.slice(0, -2);
        arr = true;
      }

      switch (true) {
        case fieldType === 'string':
          val = '';
          break;

        case fieldType === 'number':
          val = 0;
          break;

        case fieldType === 'boolean':
          val = false;
          break;

        default:
          val = initialData?.[fieldType];
          break;
      }

      if (arr) {
        val = [val];
      }

      initialData[keyName][fieldName] = val;
    });
  });

  return initialData;
};
