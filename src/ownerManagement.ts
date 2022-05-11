import { ObjectId } from 'mongodb';
import { RegisterOwner, RegisterOwnerContract, RegisterOwnerScheme } from './contracts/registerOwner';
import { Configuration } from './configuration';
import { LoginOwner, LoginOwnerContract, LoginOwnerScheme } from "./contracts/loginOwner";
import { Owner } from './databaseModels/owner';
import { normalize, invalidJson } from './utilities';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const cryptRounds = 5;

export const routeOwnerManagement = (config: Configuration): void => {


    config.app.post('/login-owner', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as LoginOwner;
        try {
            await LoginOwnerContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(LoginOwnerScheme));
            return;
        }
        body.user = normalize(body.user);
        const user = await config.owners.findOne({ user: body.user }) as Owner;
        if (user == null) {
            res.send({ error: "Invalid credentials" });
            return;
        }
        if (!await bcrypt.compare(body.pass, user.pass)) {
            res.send({ error: "Invalid credentials" });
            return;
        }
        res.send({ token: user.token });
    });


    config.app.post('/register-owner', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as RegisterOwner;
        try {
            await RegisterOwnerContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(RegisterOwnerScheme));
            return;
        }
        body.user = normalize(body.user);
        if (await config.owners.findOne({ user: body.user }) != null) {
            res.send({ error: "Owner already exists" });
            return;
        }
        const owner: Owner = {
            _id: new ObjectId(),
            user: body.user,
            pass: await bcrypt.hash(body.pass, cryptRounds),
            name: body.name,
            token: crypto.randomUUID(),
            campings: [{
                _id: new ObjectId(),
                coordinates: {
                    longitude: 45,
                    latitude: 41
                },
                name: "camping de " + body.name,
                description: "une description",
                tentPlaces: {
                    total: 12,
                    available: 3
                },
                campingcarPlaces: {
                    total: 12,
                    available: 3
                },
                bungalows: {
                    total: 12,
                    available: 3
                }
            }]
        };
        config.owners.insertOne(owner);

        res.send({ token: owner.token });
    });
}