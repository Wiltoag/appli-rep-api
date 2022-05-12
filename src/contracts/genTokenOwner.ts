import Joi from "joi";

export interface GenTokenOwner {
    token: string;
}
export const GenTokenOwnerScheme: GenTokenOwner = {
    token: "uuid token of the owner"
};
export const GenTokenOwnerContract = Joi.object({
    token: Joi.string().required()
});