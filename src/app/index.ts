import {createSchema, createYoga} from 'graphql-yoga';
import {RequestListener} from 'node:http';

export const app = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => 'world',
      },
    },
  }),
  landingPage: false,
}) as RequestListener;
