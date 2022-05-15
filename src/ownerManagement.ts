import { ChangePassOwner, ChangePassOwnerContract, ChangePassOwnerScheme } from './contracts/changePassOwner';
import { GenTokenOwner, GenTokenOwnerContract, GenTokenOwnerScheme } from './contracts/genTokenOwner';
import { ObjectId } from 'mongodb';
import { RegisterOwner, RegisterOwnerContract, RegisterOwnerScheme } from './contracts/registerOwner';
import { Configuration } from './configuration';
import { LoginOwner, LoginOwnerContract, LoginOwnerScheme } from "./contracts/loginOwner";
import { Owner } from './databaseModels/owner';
import { normalize, invalidJson, generateToken } from './utilities';

import bcrypt from 'bcrypt';
import { Errors } from './errors';

const cryptRounds = 5;

export const routeOwnerManagement = (config: Configuration): void => {


    config.app.post('/owner/generate-token', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as GenTokenOwner;
        try {
            await GenTokenOwnerContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(GenTokenOwnerScheme));
            return;
        }
        const newToken = generateToken();
        var result = await config.owners.updateOne({ token: body.token }, { $set: { token: newToken } });
        if (result.matchedCount == 0) {
            res.send(Errors.invalidToken);
            return;
        }
        res.send({ token: newToken });
    });



    config.app.post('/owner/change-pass', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as ChangePassOwner;
        try {
            await ChangePassOwnerContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(ChangePassOwnerScheme));
            return;
        }
        body.user = normalize(body.user);
        const user = await config.owners.findOne({ user: body.user }) as Owner;
        if (user == null) {
            res.send(Errors.invalidCredentials);
            return;
        }
        if (!await bcrypt.compare(body.pass, user.pass)) {
            res.send(Errors.invalidCredentials);
            return;
        }
        const newPass = await bcrypt.hash(body.newPass, cryptRounds);
        const newToken = generateToken();
        await config.owners.updateOne({ _id: user._id }, { $set: { pass: newPass, token: newToken } });
        res.send({ token: newToken });
    });



    config.app.post('/owner/login', async (req, res) => {
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
            res.send(Errors.invalidCredentials);
            return;
        }
        if (!await bcrypt.compare(body.pass, user.pass)) {
            res.send(Errors.invalidCredentials);
            return;
        }
        res.send({ token: user.token });
    });


    config.app.post('/owner/register', async (req, res) => {
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
            res.send(Errors.ownerAlreadyExists);
            return;
        }
        const owner: Owner = {
            _id: new ObjectId(),
            user: body.user,
            pass: await bcrypt.hash(body.pass, cryptRounds),
            name: body.name,
            token: generateToken(),
            campings: []
        };
        config.owners.insertOne(owner);

        res.send({ token: owner.token });
    });
}