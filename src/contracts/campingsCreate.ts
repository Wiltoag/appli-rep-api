import Joi from "joi";

export interface CampingCreate {
    token: string;
    coordinates: {
        longitude: number,
        latitude: number
    };
    name: string;
    description: string;
    bungalows: number;
    tentPlaces: number;
    campingcarPlaces: number;
}
export const CampingCreateScheme: CampingCreate = {
    token: "uuid token of the owner",
    coordinates: {
        longitude: 0.0,
        latitude: 0.0
    },
    name: "name of the camping",
    description: "description of the camping",
    bungalows: 5,
    tentPlaces: 15,
    campingcarPlaces: 12
};
export const CampingCreateContract = Joi.object({
    token: Joi.string().required(),
    coordinates: Joi.object({
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
    }).required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    bungalows: Joi.number().required(),
    tentPlaces: Joi.number().required(),
    campingcarPlaces: Joi.number().required()
});