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
import Product from '../../models/Product';
import { Context } from '../Context';
import createAccessToken from '../../utils/Auth';
import isAuth from '../../middlewares/isAuth';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => [UserTypes])
    users() {
        return User.find().populate('cart');
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    protected(@Ctx() { payload }: Context) {
        return `you have power ${payload?.userId}!`;
    }

    @Query(() => UserTypes)
    @UseMiddleware(isAuth)
    async getUserInfo(@Ctx() { payload }: Context) {
        try {
            const user = await User.findById(payload?.userId).populate('cart');

            if (!user || String(user?._id) !== payload?.userId)
                throw new Error('Operation not permited');

            return user;
        } catch (error) {
            throw new Error(error);
        }
    }

    @Query(() => UserTypes)
    async getUser(@Arg('userId') userId: string) {
        try {
            const user = await User.findById(userId).populate('cart');

            return user;
        } catch (error) {
            throw new Error(error);
        }
    }

    @Mutation(() => Boolean)
    async addProductToCart(
        @Arg('userId') userId: string,
        @Arg('productId') productId: string,
    ) {
        try {
            const product = await Product.findById(productId);

            if (!product)
                throw new Error(`Product not found with ID ${productId}`);

            await User.updateOne(
                { _id: userId },
                { $push: { cart: product.id } },
            );

            return true;
        } catch (error) {
            throw new Error(error);
        }
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
            console.error(error);
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

            res.cookie('disker', createAccessToken(user), { httpOnly: true });

            return {
                accessToken: createAccessToken(user),
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}
