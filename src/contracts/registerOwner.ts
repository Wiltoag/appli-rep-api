import Joi from "joi";

export interface RegisterOwner {
    user: string;
    pass: string;
    name: string;
}
export const RegisterOwnerScheme = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required()
});