import { WithId } from "mongodb";

export interface User extends WithId<Document> {
    user: string;
    pass: string;
    token: string;
}