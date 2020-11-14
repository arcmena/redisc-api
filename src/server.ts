/* eslint-disable prefer-destructuring */
import http, { Server } from 'http';
import express, { Application, json } from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import 'reflect-metadata';

import { UserResolver } from './graphql/Resolvers/UserResolver';
import { ProductResolver } from './graphql/Resolvers/ProductResolver';

import routes from './routes';

export default class HTTPServer {
    private app: Application;

    private server: Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.init();
        this.config();
    }

    private init() {
        this.app.use(
            cors({
                origin: 'http://localhost:3000',
                credentials: true,
            }),
        );
        this.app.use(json());
        this.app.use(cookieParser());
    }

    private async config() {
        dotenv.config();

        const app = this.app;

        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [UserResolver, ProductResolver],
            }),
            context: ({ req, res }) => ({ req, res }),
        });

        apolloServer.applyMiddleware({ app, cors: false });

        this.app.use('/api/v1', routes);
    }

    listen(path: any, callback: () => void) {
        this.server.listen(path, callback);
    }
}
