import Joi from "joi";

export interface RegisterUser {
    user: string;
    pass: string;
    name: string;
}
export const RegisterUserScheme = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required()
});