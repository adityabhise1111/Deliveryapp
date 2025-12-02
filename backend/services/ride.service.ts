import RideModel from "../model/ride.model";
import { getDistanceAndTime } from "./maps.service";
import crypto from "crypto";

export async function getFare(pickup: string, destination: string): Promise<{
    auto: number;
    car: number;
    motorcycle: number;
}> {
    if(!pickup || !destination) {
        throw new Error("Pickup and destination are required to calculate fare.");
    }

    const distanceTime = await getDistanceAndTime(pickup, destination);
    if (!distanceTime) {
        throw new Error("Could not calculate distance and time for fare calculation.");
    }
    const distanceKm = typeof distanceTime.distance === "number"
        ? distanceTime.distance/1000 //convert to km
        : parseFloat(String(distanceTime.distance));
    const durationMin = (typeof distanceTime.duration === "number"
        ? distanceTime.duration/60 //convert to minutes
        : parseFloat(String(distanceTime.duration))) / 60;

    if (!isFinite(distanceKm) || !isFinite(durationMin)) {
        throw new Error("Invalid distance or duration returned from maps service.");
    }

    const rates = {
        auto: { base: 30, perKm: 10, perMin: 0.5 },
        car: { base: 50, perKm: 15, perMin: 1.0 },
        motorcycle: { base: 20, perKm: 8, perMin: 0.3 },
    };

    const computeFare = (r: { base: number; perKm: number; perMin: number }) =>
        Math.round((r.base + r.perKm * distanceKm + r.perMin * durationMin) * 100) / 100;

    const fares = {
        auto: computeFare(rates.auto),
        car: computeFare(rates.car),
        motorcycle: computeFare(rates.motorcycle),
    };

    return fares;

}

function getOtp(num:number): string {
     return crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
}

type VehicleType = 'auto' | 'car' | 'motorcycle';
export async function createRide(user:string , pickup:string, destination:string, vehicleType:VehicleType): Promise<any> {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All parameters are required to create a ride.");
    }
    const fare = await getFare(pickup, destination);

    const newRide = new RideModel({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType],
    });
    return await newRide.save();
}


