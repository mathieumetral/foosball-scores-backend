import {writeFileSync} from 'node:fs';
import {lexicographicSortSchema, printSchema} from 'graphql';
import {schema} from '@app/schema';

writeFileSync(`./schema.graphql`, printSchema(lexicographicSortSchema(schema)));
