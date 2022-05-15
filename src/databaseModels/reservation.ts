export enum ReservationMode {
    bungalow = 0,
    campingCar = 1,
    tent = 2
}
export interface Reservation {
    camping: string;
    mode: ReservationMode;
}