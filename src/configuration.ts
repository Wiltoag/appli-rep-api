import { User } from './databaseModels/user';
import { Db, Collection } from 'mongodb';
import { Express } from 'express';
export interface Configuration {
    app: Express;
    users: Collection<any>;
    owners: Collection<any>;
}