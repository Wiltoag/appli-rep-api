import Joi from "joi";

export interface CampingDetail {
    id: string;
}
export const CampingDetailScheme: CampingDetail = {
    id: "id of the camping"
};
export const CampingDetailContract = Joi.object({
    id: Joi.string().required()
});