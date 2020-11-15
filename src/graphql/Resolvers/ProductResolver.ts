/* eslint-disable import/prefer-default-export */
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import Product, { ProductTypes } from '../../models/Product';

@Resolver()
export class ProductResolver {
    @Query(() => ProductTypes)
    product(@Arg('_id') _id: string) {
        return Product.findById(_id);
    }

    @Query(() => [ProductTypes])
    productsIndex() {
        return Product.find();
    }

    @Query(() => [ProductTypes])
    async filterProducts(@Arg('name') name: string) {
        try {
            const products = Product.find({ name: new RegExp(name, 'i') });

            return products;
        } catch (error) {
            throw new Error(error);
        }
    }

    @Query(() => [ProductTypes])
    async getRelatedProducts(@Arg('tag') tag: string) {
        try {
            return Product.find({ category: new RegExp(tag, 'i') });
        } catch (error) {
            throw new Error(error);
        }
    }

    @Mutation(() => Boolean)
    async registerProduct(
        @Arg('id') _id: string,
        @Arg('name') name: string,
        @Arg('description') description: string,
        @Arg('value') value: number,
        @Arg('category') category: string,
        @Arg('band') band: string,
    ) {
        try {
            await Product.findByIdAndUpdate(_id, {
                name,
                description,
                value,
                category,
                band,
            });
        } catch (error) {
            console.error(error);
            return false;
        }

        return true;
    }
}
