import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';

import { Context } from '../graphql/Context';

const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
    const authorization = context.req.headers.authorization?.split(' ');

    if (!authorization) {
        throw new Error('Not authorized');
    }

    try {
        // const payload = verify(
        //     token,
        //     process.env.JWT_SECRET!,
        //     (error, response) => {
        //         if (error || !response) {
        //             throw new Error('Invalid token');
        //         }

        //         context.payload = payload as any;

        //         next();
        //     },
        // );

        const payload = verify(authorization[1], process.env.JWT_SECRET!);
        context.payload = payload as any;
    } catch (error) {
        throw new Error('Invalid token');
    }

    return next();
};

export default isAuth;
