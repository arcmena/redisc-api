import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import User from '../models/User';
import createAccessToken from '../utils/Auth';

export default async (req: Request, res: Response) => {
    const token = req.cookies.disker;

    if (!token) return res.send({ accessToken: '' });

    let payload: any = null;

    try {
        payload = verify(
            token,
            process.env.JWT_SECRET!,
            (error: any, response: any) => {
                if (error || !response) throw new Error(error);
                return response;
            },
        );
    } catch (error) {
        res.status(401).send({ error: error.message });
    }

    const user = await User.findById({ _id: payload.userId });

    if (!user) return res.send({ accessToken: '' });

    return res.send({ accessToken: createAccessToken(user) });
};
