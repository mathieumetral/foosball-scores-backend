import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import {PageCursors} from '@lib/pagination/types';

export const schemaBuilder = new SchemaBuilder<{
  Connection: {
    pageCursors: PageCursors;
  };
}>({
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
