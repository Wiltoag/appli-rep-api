import { ObjectId } from "mongodb";

export interface Camping {
    _id?: ObjectId;
    coordinates: {
        longitude: number,
        latitude: number
    };
    name: string;
    description: string;
    city: string;
    bungalows: {
        total: number,
        available: number
    };
    tentPlaces: {
        total: number,
        available: number
    };
    campingcarPlaces: {
        total: number,
        available: number
    }
}