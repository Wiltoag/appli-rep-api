import Joi from "joi";

export interface AuthUser {
    user: string;
    pass: string;
}
export const AuthUserScheme = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required()
});