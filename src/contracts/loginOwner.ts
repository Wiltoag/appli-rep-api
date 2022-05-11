import Joi from "joi";

export interface LoginOwner {
    user: string;
    pass: string;
}
export const LoginOwnerScheme = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required()
});