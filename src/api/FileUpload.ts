import { Request, Response } from 'express';
import Product from '../models/Product';

export default async (req: Request, res: Response) => {
    try {
        const { filename } = req.file;

        const product = await Product.create({
            image: `http://localhost:3030/api/v1/covers/${filename}`,
        });

        res.status(201).send({ product_id: product._id });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
