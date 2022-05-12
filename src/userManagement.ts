import { ChangePassUser, ChangePassUserScheme, ChangePassUserContract } from './contracts/changePassUser';
import { GenTokenUser, GenTokenUserContract, GenTokenUserScheme } from './contracts/genTokenUser';
import { ObjectId } from 'mongodb';
import { RegisterUser, RegisterUserContract, RegisterUserScheme } from './contracts/registerUser';
import { Configuration } from './configuration';
import { LoginUser, LoginUserContract, LoginUserScheme } from "./contracts/loginUser";
import { User } from './databaseModels/user';
import { normalize, invalidJson, generateToken } from './utilities';

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Errors } from './errors';

const cryptRounds = 5;

export const routeUserManagement = (config: Configuration): void => {


    config.app.post('/user/generate-token', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as GenTokenUser;
        try {
            await GenTokenUserContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(GenTokenUserScheme));
            return;
        }
        const newToken = generateToken();
        var result = await config.users.updateOne({ token: body.token }, { $set: { token: newToken } });
        if (result.matchedCount == 0) {
            res.send(Errors.invalidToken);
            return;
        }
        res.send({ token: newToken });
    });



    config.app.post('/user/change-pass', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as ChangePassUser;
        try {
            await ChangePassUserContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(ChangePassUserScheme));
            return;
        }
        body.user = normalize(body.user);
        const user = await config.users.findOne({ user: body.user }) as User;
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
        await config.users.updateOne({ _id: user._id }, { $set: { pass: newPass, token: newToken } });
        res.send({ token: newToken });
    });


    config.app.post('/user/login', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as LoginUser;
        try {
            await LoginUserContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(LoginUserScheme));
            return;
        }
        body.user = normalize(body.user);
        const user = await config.users.findOne({ user: body.user }) as User;
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


    config.app.post('/user/register', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as RegisterUser;
        try {
            await RegisterUserContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(RegisterUserScheme));
            return;
        }
        body.user = normalize(body.user);
        if (await config.users.findOne({ user: body.user }) != null) {
            res.send(Errors.userAlreadyExists);
            return;
        }
        const user: User = {
            _id: new ObjectId(),
            user: body.user,
            pass: await bcrypt.hash(body.pass, cryptRounds),
            name: body.name,
            token: crypto.randomUUID()
        };
        config.users.insertOne(user);

        res.send({ token: user.token });
    });
}