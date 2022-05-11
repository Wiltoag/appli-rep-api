import Joi from "joi";

export interface LoginUser {
    user: string;
    pass: string;
}
export const LoginUserScheme: LoginUser = {
    user: "user id",
    pass: "password"
};
export const LoginUserContract = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required()
});