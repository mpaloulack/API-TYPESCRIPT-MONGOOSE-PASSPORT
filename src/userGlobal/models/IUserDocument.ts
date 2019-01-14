import { Document } from "mongoose";

export interface IUserDocument extends Document {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
    phone: number;
    createdAt: Date;
    modifiedAt: Date;
    roles: [string];
    loginHistory: [any];
    oAuth: [any];
}
