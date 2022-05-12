import Joi from "joi";

export interface ChangePassOwner {
    user: string;
    pass: string;
    newPass: string;
}
export const ChangePassOwnerScheme: ChangePassOwner = {
    user: "user id",
    pass: "old password",
    newPass: "new password"
};
export const ChangePassOwnerContract = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required(),
    newPass: Joi.string().required()
});