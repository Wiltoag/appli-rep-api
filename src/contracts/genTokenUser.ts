import Joi from "joi";

export interface GenTokenUser {
    token: string;
}
export const GenTokenUserScheme: GenTokenUser = {
    token: "uuid token of the user"
};
export const GenTokenUserContract = Joi.object({
    token: Joi.string().required()
});