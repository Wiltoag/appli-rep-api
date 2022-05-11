import { routeCampingManagement } from './campingManagement';
import { routeOwnerManagement } from './ownerManagement';
import { Configuration } from './configuration';
import { Db, MongoClient } from 'mongodb';
import express from 'express';
import { routeUserManagement } from './userManagement';

const configuration: Configuration = {
    app: express(),
    users: null!,
    owners: null!
};
configuration.app.use(express.json());
const port = 16548;
const dbPort = 27017;

const mongoClient = new MongoClient(`mongodb://localhost:${dbPort}`);


configuration.app.get('/', (req, res) => {
    res.status(404).send();
});

routeUserManagement(configuration);
routeOwnerManagement(configuration);
routeCampingManagement(configuration);

configuration.app.listen(port, async () => {
    await mongoClient.connect();
    const db = mongoClient.db("applirep");
    await db.command({ ping: 1 });
    configuration.users = db.collection("users");
    configuration.owners = db.collection("owners");
    console.log(`Express is listening at http://localhost:${port}`);
});