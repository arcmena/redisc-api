/* eslint-disable import/prefer-default-export */
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcrypt';

import User, { UserTypes } from '../../models/User';
import { Context } from '../Context';
import { createAccessToken, createRefreshToken } from '../../utils/Auth';
import isAuth from '../isAuth';

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

    @Query(() => String)
    @UseMiddleware(isAuth)
    protected(@Ctx() { payload }: Context) {
        return `you have power ${payload?.userID}!`;
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
        @Ctx() { res }: Context,
    ): Promise<LoginResponse> {
        try {
            const user = await User.findOne({ email });

            if (!user || !(await compare(password, user.password))) {
                throw new Error('Invalid credentials');
            }

            res.cookie('disker', createRefreshToken(user), { httpOnly: true });

            return {
                accessToken: createAccessToken(user),
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
