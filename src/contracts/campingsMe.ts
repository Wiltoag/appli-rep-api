import Joi from "joi";

export interface CampingMe {
    token: string;
}
export const CampingMeScheme: CampingMe = {
    token: "uuid token of the owner"
};
export const CampingMeContract = Joi.object({
    token: Joi.string().required()
});