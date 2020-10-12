import { Router, static as Static } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { resolve } from 'path';
import multer from 'multer';

import { UserResolver } from './graphql/Resolvers/UserResolver';
import { ProductResolver } from './graphql/Resolvers/ProductResolver';

import RefreshToken from './api/RefreshToken';
import FileUpload from './api/FileUpload';

import multerConfig from './config/multer';

const router = Router();

const upload = multer(multerConfig);

router.get('/', (_req, res) => {
    res.send({
        version: '0.0.1',
    });
});

router.post('/refresh_token', RefreshToken);

router.post('/cover_upload', upload.single('image'), FileUpload);

router.use('/covers', Static(resolve(__dirname, '..', 'uploads')));

(async () => {
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, ProductResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app: router, cors: false });
})();

export default router;
