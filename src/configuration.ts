import { Db } from 'mongodb';
import { Express } from 'express';
export interface Configuration {
    app: Express;
    database: Db;
}