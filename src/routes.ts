import { Router } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { verify } from 'jsonwebtoken';

import { UserResolver } from './graphql/Resolvers/UserResolver';
import { createAccessToken } from './utils/Auth';
import User from './models/User';

const router = Router();

router.get('/', (_req, res) => {
    res.send({
        version: '1.0.0',
    });
});

router.post('/refresh_token', async (req, res) => {
    const token = req.cookies.disker;

    if (!token) return res.send({ ok: false, accesToken: '' });

    let payload: any = null;

    try {
        payload = verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        console.log(error);
        if (!token) return res.send({ ok: false, accesToken: '' });
    }

    const user = await User.findById({ _id: payload.userId });

    if (!user) return res.send({ ok: false, accesToken: '' });

    return res.send({ ok: true, accesToken: createAccessToken(user) });
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
