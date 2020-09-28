import { Schema, Document, model as Model } from 'mongoose';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class UserTypes {
    @Field(() => ID)
    _id: string;

    @Field()
    name: string;

    @Field()
    email: string;
}

export interface UserInterface extends Document {
    name: string;
    email: string;
    password: string;
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
});

export default Model<UserInterface>('User', UserSchema);
