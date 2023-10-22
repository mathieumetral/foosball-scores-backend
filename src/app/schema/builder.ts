import SchemaBuilder from '@pothos/core';

export const schemaBuilder = new SchemaBuilder({});

schemaBuilder.queryType({
  fields: t => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, {name}) => `Hello ${name ?? 'World'}`,
    }),
  }),
});
