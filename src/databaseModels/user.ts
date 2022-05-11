import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    user: string;
    pass: string;
    token: string;
    name: string;
}