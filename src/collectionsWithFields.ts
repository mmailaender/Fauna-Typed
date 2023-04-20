
type CollectionsWithFieldsType = {
  name: string;
  fields: { name: string; type: string }[];
};

export const getCollectionsWithFields = (schema: {
  [key: string]: { fields: { [key: string]: any } };
}): CollectionsWithFieldsType[] => {
  return Object.keys(schema).map(collectionName => {
    const fields = schema[collectionName as keyof typeof schema].fields;

    const mappedFields = Object.keys(fields).map(fieldKey => {
      const fieldValue = fields[fieldKey as keyof typeof fields];

      if (typeof fieldValue === 'object') {
        return {
          name: fieldKey,
          type: 'object',
        };
      }
      return {
        name: fieldKey,
        type: fieldValue,
      };
    });

    return {
      name: collectionName,
      fields: mappedFields,
    };
  });
};
