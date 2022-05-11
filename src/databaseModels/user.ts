import { WithId } from "mongodb";

export interface User extends Document {
    user: string;
    pass: string;
    token: string;
    name: string;
}