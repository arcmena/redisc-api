import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';

import Router from './routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.get('/', (_req, res) => {
    res.send({
        redisc: '2020 - All rights reserved',
    });
});

app.use('/api/v1', Router);

export default app;
