import { Schema, Document, model as Model } from 'mongoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class ProductTypes {
    @Field(() => ID)
    _id: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    description: string;

    @Field({ nullable: true })
    value: number;

    @Field({ nullable: true })
    category: string;

    @Field({ nullable: true })
    image: string;
}

export interface ProductInterface extends Document {
    name?: string;
    description?: string;
    value?: number;
    category?: string;
    image?: string;
}

const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    value: {
        type: Number,
        default: null,
    },
    category: {
        type: String,
        enum: ['none', 'rock', 'indie', 'trap', 'lo-fi', 'rap'],
        default: 'none',
    },
    image: {
        type: String,
        default: null,
    },
});

export default Model<ProductInterface>('Product', ProductSchema);
