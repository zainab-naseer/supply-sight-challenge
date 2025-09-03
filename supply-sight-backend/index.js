import { ApolloServer } from 'apollo-server';

import typeDefs from './graphql/schema/index.js';
import resolvers from './graphql/resolver/index.js';

const port = 4000;

const app = new ApolloServer({ typeDefs, resolvers });

app.listen(port, () => {
  console.log(`GraphQL server is listening at http://localhost:${port}`);
});