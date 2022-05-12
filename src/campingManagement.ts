import { Owner } from './databaseModels/owner';
import { invalidJson } from './utilities';
import { CampingMe, CampingMeContract, CampingMeScheme } from './contracts/campingsMe';
import { Configuration } from './configuration';
import { Errors } from './errors';

export const routeCampingManagement = (config: Configuration): void => {

    config.app.get("/campings/me", async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as CampingMe;
        try {
            await CampingMeContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(CampingMeScheme));
            return;
        }
        const user = await config.owners.findOne({ token: body.token }) as Owner;
        if (user == null) {
            res.send(Errors.invalidToken);
            return;
        }
        user.campings.forEach(camping => {
            delete camping._id;
        });
        res.send(user.campings);
    });


    config.app.get("/campings", async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const campings = await config.owners.aggregate([{ $unwind: "$campings" }, { $addFields: { "campings.id": "$campings._id" } }]).toArray();
        campings.forEach(camping => {
            delete camping.campings._id;
        });
        res.send(campings.map(camping => camping.campings));
    });


}