import Joi from "joi";

type Mode = 'bungalow' | 'camping-car' | 'tent';
export interface CampingReserve {
    token: string;
    id: string;
    mode: Mode;
}
export const CampingReserveScheme = {
    token: "uuid token of the user",
    id: "id of the camping to rent",
    mode: "'bungalow' 'camping-car' or 'tent'"
};
export const CampingReserveContract = Joi.object({
    token: Joi.string().required(),
    id: Joi.string().required(),
    mode: Joi.string().regex(/^tent$|^bungalow$|^camping-car$/).required()
});