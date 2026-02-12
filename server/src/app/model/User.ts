import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
    {
        googleId: {
            type: String,
            required: [true, "Google Id is required"],
            unique: [true, "This Google User already exists."],
            index: true,
        },
        email: {
            type: String,
            required: [true, "User email is required"],
            unique: [true, "This Google User already exists."],
            trim: true,
            lowercase: true,
        },
        name: String,
        pictureUrl: String,
        accessToken: String,
        refreshToken: String,
        accessTokenExpiresAt: Date,
    },
    { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema>; // TS User type that can be used as needed
const UserModel = model<User>("User", userSchema);
export default UserModel;
