import { Router } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { UserResolver } from './graphql/Resolvers/UserResolver';

const router = Router();

router.get('/', (_req, res) => {
    res.send({
        version: '1.0.0',
    });
});

(async () => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app: router });
})();

export default router;
