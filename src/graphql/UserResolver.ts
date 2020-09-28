/* eslint-disable import/prefer-default-export */
import {
    Arg,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import User, { UserTypes } from '../models/User';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [UserTypes])
    users() {
        return User.find();
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('name') name: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
    ) {
        const passwordHash = await hash(password, 8);

        try {
            await User.create({ name, email, password: passwordHash });
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }

    @Mutation(() => LoginResponse)
    async auth(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ): Promise<LoginResponse> {
        try {
            const user = await User.findOne({ email });

            if (!user || !(await compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }

            return {
                accessToken: sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_SECRET || '',
                    { expiresIn: '1d' },
                ),
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
