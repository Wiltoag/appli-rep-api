import { ObjectId } from 'mongodb';
import { Camping } from './camping';
export interface Owner {
    _id?: ObjectId;
    user: string;
    pass: string;
    token: string;
    name: string;
    campings: Camping[];
}