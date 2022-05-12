import Joi from "joi";

export interface ChangePassUser {
    user: string;
    pass: string;
    newPass: string;
}
export const ChangePassUserScheme: ChangePassUser = {
    user: "user id",
    pass: "old password",
    newPass: "new password"
};
export const ChangePassUserContract = Joi.object({
    user: Joi.string().required(),
    pass: Joi.string().required(),
    newPass: Joi.string().required()
});