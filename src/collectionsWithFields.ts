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
  return Object.keys(schema).map(collectionName => {
    const fields = schema[collectionName as keyof typeof schema].fields;

    return {
      name: collectionName,
      fields: getFields(fields),
    };
  });
};
