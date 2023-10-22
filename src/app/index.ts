import {createYoga} from 'graphql-yoga';
import {RequestListener} from 'node:http';
import {schema} from '@app/schema';

export const app = createYoga({
  schema,
  landingPage: false,
}) as RequestListener;
