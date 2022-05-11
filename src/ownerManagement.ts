import { RegisterOwner, RegisterOwnerContract, RegisterOwnerScheme } from './contracts/registerOwner';
import { Configuration } from './configuration';
import { LoginOwner, LoginOwnerContract, LoginOwnerScheme } from "./contracts/loginOwner";
import { Owner } from './databaseModels/owner';
import { normalize, invalidJson } from './utilities';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const cryptRounds = 5;

export const routeOwnerManagement = (config: Configuration): void => {


    config.app.get('/login-owner', async (req, res) => {
        res.setHeader('content-type', 'application/json');
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


    config.app.get('/register-owner', async (req, res) => {
        res.setHeader('content-type', 'application/json');
        const body = req.body as RegisterOwner;
        try {
            await RegisterOwnerContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(RegisterOwnerScheme));
            return;
        }
        if (await config.owners.findOne({ user: body.user }) != null) {
            res.send({ error: "Owner already exists" });
            return;
        }
        const user: Owner = {
            user: normalize(body.user),
            pass: await bcrypt.hash(body.pass, cryptRounds),
            name: body.name,
            token: crypto.randomUUID()
        };
        config.owners.insertOne(user);

        res.send({ token: user.token });
    });
}