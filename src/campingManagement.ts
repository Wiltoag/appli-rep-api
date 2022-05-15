import { User } from './databaseModels/user';
import { CampingReserve, CampingReserveContract, CampingReserveScheme } from './contracts/campingsReserve';
import { CampingDetail, CampingDetailContract, CampingDetailScheme } from './contracts/campingsDetail';
import { ObjectId } from 'mongodb';
import { CampingCreate, CampingCreateContract, CampingCreateScheme } from './contracts/campingsCreate';
import { Owner } from './databaseModels/owner';
import { invalidJson } from './utilities';
import { CampingMe, CampingMeContract, CampingMeScheme } from './contracts/campingsMe';
import { Configuration } from './configuration';
import { Errors } from './errors';
import { Camping } from './databaseModels/camping';

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
        res.send(user.campings.map(camping => { return { id: camping._id } }));
    });


    config.app.post("/campings/create", async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as CampingCreate;
        try {
            await CampingCreateContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(CampingCreateScheme));
            return;
        }
        const camping: Camping = {
            _id: new ObjectId(),
            coordinates: body.coordinates,
            name: body.name,
            description: body.description,
            bungalows: {
                total: body.bungalows,
                available: body.bungalows
            },
            tentPlaces: {
                total: body.tentPlaces,
                available: body.tentPlaces
            },
            campingcarPlaces: {
                total: body.campingcarPlaces,
                available: body.campingcarPlaces
            }
        };
        const result = await config.owners.updateOne({ token: body.token }, { $push: { campings: camping } });
        if (result.matchedCount == 0) {
            res.send(Errors.invalidToken);
            return;
        }
        res.send({ id: camping._id });
    });


    config.app.get("/campings", async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const campings = await config.owners.aggregate([{ $unwind: "$campings" }]).toArray();
        res.send(campings.map(camping => { return { id: camping.campings._id } }));
    });


    config.app.get("/campings/detail", async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as CampingDetail;
        try {
            await CampingDetailContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(CampingDetailScheme));
            return;
        }
        try {
            const camping = (await config.owners.aggregate([{ $unwind: "$campings" }, { $match: { "campings._id": new ObjectId(body.id) } }]).next())?.campings as Camping;
            if (camping == null) {
                res.send(Errors.campingIdDoesNotExist);
                return;
            }
            delete camping._id;
            res.send(camping);
        } catch (error) {
            res.send(Errors.campingIdDoesNotExist);
            return;
        }
    });


    config.app.post("/campings/reserve", async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const body = req.body as CampingReserve;
        try {
            await CampingReserveContract.validateAsync(body);
        }
        catch (error) {
            res.send(invalidJson(CampingReserveScheme));
            return;
        }
        try {
            const camping = (await config.owners.aggregate([{ $unwind: "$campings" }, { $match: { "campings._id": new ObjectId(body.id) } }]).next())?.campings as Camping;
            if (camping == null) {
                res.send(Errors.campingIdDoesNotExist);
                return;
            }
            const user = await config.users.findOne({ token: body.token }) as User;
            if (user == null) {
                res.send(Errors.invalidToken);
                return;
            }
            switch (body.mode) {
                case "bungalow":
                    if (camping.bungalows.available > 0) {

                    } else {
                        res.send(Errors.noPlaceAvailable);
                        return;
                    }
            }

        } catch (error) {
            res.send(Errors.campingIdDoesNotExist);
            return;
        }
    });


}