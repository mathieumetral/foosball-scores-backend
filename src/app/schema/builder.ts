import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';

export const schemaBuilder = new SchemaBuilder({
  plugins: [RelayPlugin],
  relayOptions: {},
});

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
