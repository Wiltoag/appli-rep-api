import { RegisterUser, RegisterUserScheme } from './contracts/registerUser';
import { Configuration } from './configuration';
import { LoginUser, LoginUserScheme } from "./contracts/loginUser";
import { User } from './databaseModels/user';
import { normalize } from './utilities';

import bcrypt from 'bcrypt';
import crypto from 'crypto';

const cryptRounds = 5;

export const routeUserManagement = (config: Configuration): void => {


    config.app.get('/login-user', async (req, res) => {
        res.setHeader('content-type', 'application/json');
        const body = req.body as LoginUser;
        try {
            await LoginUserScheme.validateAsync(body);
        }
        catch (error) {
            res.send({ error: "Invalid JSON format" });
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


    config.app.get('/register-user', async (req, res) => {
        res.setHeader('content-type', 'application/json');
        const body = req.body as RegisterUser;
        try {
            await RegisterUserScheme.validateAsync(body);
        }
        catch (error) {
            res.send({ error: "Invalid JSON format" });
            return;
        }
        if (await config.users.findOne({ user: body.user }) != null) {
            res.send({ error: "User already exists" });
            return;
        }
        const user = {
            user: normalize(body.user),
            pass: await bcrypt.hash(body.pass, cryptRounds),
            name: body.name,
            token: crypto.randomUUID()
        };
        config.users.insertOne(user);

        res.send({ token: user.token });
    });
}