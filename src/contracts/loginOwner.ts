import Joi from "joi";

export interface LoginOwner {
    user: string;
    pass: string;
}
export const LoginOwnerScheme: LoginOwner = {
    user: "user id",
    pass: "password"
};
export const LoginOwnerContract = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required()
});