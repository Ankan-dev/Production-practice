import { Schema, model } from "mongoose";

export type UserDocument = {
  name: string;
  email: string;
  password: string;
};

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);
