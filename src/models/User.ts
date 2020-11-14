/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import { Schema, Document, model as Model } from 'mongoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { ProductTypes } from './Product';

@ObjectType()
export class UserTypes {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    cpf: string;

    @Field({ nullable: true })
    birth_date: Date;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    town_city: string;

    @Field({ nullable: true })
    country: string;

    @Field({ nullable: true })
    postcode: string;

    @Field((_type) => [ProductTypes], { nullable: true })
    cart: ProductTypes[];
}

export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    birth_date?: string;
    address?: string;
    town_city?: string;
    country?: string;
    postcode?: string;
    cart?: ProductTypes[];
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: false,
        maxlength: 11,
    },
    birth_date: {
        type: Date,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    town_city: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    postcode: {
        type: String,
        required: false,
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
});

export default Model<UserInterface>('User', UserSchema);
