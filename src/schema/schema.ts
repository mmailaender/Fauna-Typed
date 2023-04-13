export const schema = {
  Order: {
    fields: {
      id: 'string',
      name: 'string | unknown',
      age: 'int | string',
      address: {
        id: 'string',
        street: 'string',
        city: 'string',
        state: 'string',
        country: 'string',
        postCode: 'int | string',
      },
    },
  },

  Product: {
    fields: {
      id: 'string',
      manufacturerProductId: 'string',
    },
  },

  Test: {
    fields: {
      id: 'string',
      firstName: 'string',
      lastName: 'string',
    },
  },
};
