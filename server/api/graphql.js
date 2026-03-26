import { ApolloServer } from '@apollo/server';
import { startServerAndCreateVercelHandler } from '@as-integrations/vercel';
import { typeDefs } from '../src/schema.js';
import { resolvers } from '../src/resolvers.js';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateVercelHandler(server, {
  context: async ({ req }) => ({ req }),
});
