import { Configuration } from './configuration';
import bcrypt from 'bcrypt';
import { LoginUser, LoginUserScheme } from "./contracts/loginUser";
import { User } from './databaseModels/user';
import { normalize } from './utilities';

export function routeUserManagement(config: Configuration): void {


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
        console.log(body.user);
        const user = await config.database.collection("users").findOne({ user: body.user }) as User;
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
}