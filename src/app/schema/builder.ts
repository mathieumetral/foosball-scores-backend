import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import {PageCursors} from '@lib/pagination/types';
import {DateTimeResolver} from 'graphql-scalars';

export const schemaBuilder = new SchemaBuilder<{
  Connection: {
    pageCursors: PageCursors;
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [RelayPlugin],
  relayOptions: {},
});

schemaBuilder.addScalarType('DateTime', DateTimeResolver, {});

schemaBuilder.queryType();
schemaBuilder.mutationType();
