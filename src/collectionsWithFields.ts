type CollectionsWithFieldsType = {
  name: string;
  fields: { name: string; type: string }[];
};

export const getCollectionsWithFields = (): Promise<CollectionsWithFieldsType[]> => {
  console.log(
    'window.process====',
    window.process,
    'procss======',
    process.env
  );
  return import(`${`${window.process.env?.PWD}/fqlx.schema.json`}`)
    .then(data => {
      const schema = data.default;

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
    })
    .catch(err => {
      throw err;
    });
};
