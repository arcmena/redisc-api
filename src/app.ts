import express, { json } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';

import { UserResolver } from './graphql/Resolvers/UserResolver';
import { ProductResolver } from './graphql/Resolvers/ProductResolver';

import Router from './routes';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);

app.use(json());
app.use(cookieParser());

app.get('/', (_req, res) => {
    res.send({
        redisc: '2020 - All rights reserved',
    });
});

(async () => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ProductResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });
})();

app.use('/api/v1', Router);

export default app;
