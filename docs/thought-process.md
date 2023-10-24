# My Thought Process

This file is a supplement to the README provided at the root. Its purpose is to explain my thought process, technical choices, and the mindset I adopted.

## Adopted Mindset

In this project, I aimed to use tools and technologies that I find suitable for larger-scale projects. This project might not necessarily require such comprehensive technologies, and the initial request could undoubtedly be addressed without them. However, the idea was to answer the question, "What is your ideal tech stack?" and also to elucidate the reasons behind my choices.

This is also the reason why I chose to separate the frontend from the backend. We could have done everything within a single Next.js project, for instance. However, in large-scale projects, there often comes a time when we might want to have both a website and a mobile application as clients. Both would then share the same backend API.

## Chosen Technologies

- **NodeJS**
  - Highly developed dependency ecosystem (NPM).
  - Makes the transition from frontend to backend smoother.
  - Has a promising future, especially with Deno, which aims to be more efficient but is still too young to be widely adopted.


- **GraphQL**
  - Developed and used by Facebook (reliability, ever-growing community).
  - Allows for a typed API and comprehensive documentation.
  - Enables the client to specify the exact data it needs, which can reduce the amount of data transferred over the network and speed up page loads.

## Structure

The project's folder structure and organization are built around the concept of smart data objects. This is a concept used at Facebook to structure large-scale projects. Additionally, we adhere to an object-oriented approach, which brings several advantages:

1. Single Source of Truth
2. Close to GraphQL Schema
3. Facilitates Easy Implementation of https://github.com/graphql/dataloader and Authentication on sub objects

For more information, there are two talks by the co-creator of GraphQL on this topic: https://www.youtube.com/watch?v=6NYC-k2Abow and https://www.youtube.com/watch?v=etax3aEe2dA.

### Folder

The project's code is located in the `src` directory, which contains the following subdirectories:

- `app`: This directory includes everything related to GraphQL implementation. For example, the schema builder is located here.
- `data`: This directory contains everything related to data sources (PostgreSQL, memory, REST API, etc.).
- `features`: This directory contains all the features offered in our API.
- `lib`: This directory includes custom libraries used in our code.

This structure also aligns closely with the Next.js project structure, which is widely used in frontend projects. It helps avoid a disconnect between frontend and backend structures, especially when the same developers are working on both parts.

## GraphQL Specifications

This project adheres to two GraphQL specifications:

1. [Global Object Identification](https://graphql.org/learn/global-object-identification/)
2. [Cursor Connections](https://relay.dev/graphql/connections.htm)
