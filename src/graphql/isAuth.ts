import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';

import { Context } from './Context';

const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    try {
        const [, token] = context.req.headers.authorization?.split(' ');

        if (!token) {
            throw new Error('Not authorized');
        }

        // const payload = verify(token, process.env.JWT_SECRET!);

        const payload = verify(
            token,
            process.env.JWT_SECRET!,
            (error, response) => {
                if (error || !response) {
                    throw new Error('Invalid token');
                }

                context.payload = payload as any;

                next();
            },
        );
    } catch (error) {
        throw new Error(error);
    }
};

export default isAuth;
