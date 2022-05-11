import { ObjectId } from 'mongodb';
import { RegisterUser, RegisterUserContract, RegisterUserScheme } from './contracts/registerUser';
import { Configuration } from './configuration';
import { LoginUser, LoginUserContract, LoginUserScheme } from "./contracts/loginUser";
import { User } from './databaseModels/user';
import { normalize, invalidJson } from './utilities';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const cryptRounds = 5;

export const routeUserManagement = (config: Configuration): void => {


    config.app.post('/login-user', async (req, res) => {
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
            res.send({ error: "Invalid credentials" });
            return;
        }
        if (!await bcrypt.compare(body.pass, user.pass)) {
            res.send({ error: "Invalid credentials" });
            return;
        }
        res.send({ token: user.token });
    });


    config.app.post('/register-user', async (req, res) => {
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
            res.send({ error: "User already exists" });
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