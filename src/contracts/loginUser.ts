import Joi from "joi";

export interface LoginUser {
    user: string;
    pass: string;
}
export const LoginUserScheme = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required()
});