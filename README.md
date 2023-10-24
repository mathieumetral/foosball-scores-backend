# Foosball Scores - Backend

This project aims to provide an API for the frontend client (https://github.com/mathieumetral/foosball-scores-frontend). It allows for tracking scores in foosball matches and is connected to a database for storing game results.

For more technical information, please visit my [Thought Process](https://github.com/mathieumetral/foosball-scores-backend/blob/main/docs/thought-process.md).

## Prerequisites

- Node.js

## How to run this project

_Please note that the Docker Compose file here contains only the PostgreSQL and Adminer containers. It does not include any containers specific to the project._

### Run the Development Server

```bash
# Install dependencies
yarn install # or npm install

# Start up the database
docker compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Run the development server
yarn dev # or npm run dev
```

### Run the Production Server

```bash
# Install dependencies
yarn install # or npm install

# Start up the database
docker compose up -d

# Run Prisma migrations
npx prisma migrate deploy

# Build
yarn build # or npm run build

# Run the server
yarn start # or npm run start
```

## API Documentation

The API documentation is accessible at http://localhost:4000/graphql. This interface, powered by GraphiQL, allows for testing and exploration of the API once the server is up and running.

## Dependencies

Below is a list of dependencies used in this project, along with their purpose as defined in the `package.json`:

- `@pothos/core`: Schema builder for GraphQL. I prefer it over graphql-js because of its simpler syntax and a variety of plugins. Moreover, it is widely adopted by large companies like Airbnb and Netflix.
- `@pothos/plugin-relay`: A Pothos plugin for simplifying adherence to GraphQL specifications (Global Identification + Cursor Connection).
- `@prisma/client`: Prisma is used for communicating with the database, and this package contains the client.
- `graphql`: An essential package for working with GraphQL.
- `graphql-scalars`: A library of custom GraphQL Scalars for creating precise type-safe GraphQL schemas. Used for the DateTime scalar.
- `graphql-yoga`: GraphQL Yoga is a GraphQL server that simplifies setup and focuses on performance. It is developed by The Guild, which has strong ties to the GraphQL Foundation and serves large companies such as Air France, KLM, Microsoft, and Uber, among others. Additionally, it has a robust GraphQL ecosystem with various plugins.

### Dev

- `@total-typescript/ts-reset`: Enhances TypeScript behavior (e.g., `JSON.parse` returns `unknown`, `.filter(Boolean)` behaves as expected, and more improvements). [Learn more](https://www.totaltypescript.com/ts-reset).
- `@types/node`: TypeScript type definitions for Node.js.
- `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser`: Integration of TypeScript with ESLint.
- `esbuild`: Used for building the project.
- `eslint`: Enforces code style and rules.
- `eslint-plugin-import` and `eslint-import-resolver-typescript`: Enhances ESLint's handling of TypeScript imports.
- `prettier`: Guarantees uniform code style.
- `prisma`: Used for communicating with the database.
- `tsx`: Used for `yarn dev`
- `typescript`: Enables the use of typed JavaScript (TypeScript).
