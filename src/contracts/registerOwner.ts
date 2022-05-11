import Joi from "joi";

export interface RegisterOwner {
    user: string;
    pass: string;
    name: string;
}
export const RegisterOwnerScheme: RegisterOwner = {
    user: "user id",
    pass: "password",
    name: "display name"
};
export const RegisterOwnerContract = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required(),
    name: Joi.string().required()
});