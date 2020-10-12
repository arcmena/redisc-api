/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sign } from 'jsonwebtoken';

import { UserInterface } from '../models/User';

const createAccessToken = (user: UserInterface) => {
    return sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' },
    );
};

export default createAccessToken;
