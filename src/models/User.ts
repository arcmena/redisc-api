import { Schema, Document, model as Model } from 'mongoose';

export interface UserInterface extends Document {
    email: string;
    name: string;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
});

export default Model<UserInterface>('User', UserSchema);
