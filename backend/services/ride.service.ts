import RideModel, { IRide } from "../model/ride.model";
import { getDistanceAndTime } from "./maps.service";

import crypto from "crypto";
import { ICaptain } from "../model/captain.model";
import { validationResult } from "express-validator";
import { sendMessageToSocket } from "./socket";

export async function getFare(pickup: string, destination: string): Promise<{
    auto: number;
    car: number;
    motorcycle: number;
}> {
    if (!pickup || !destination) {
        throw new Error("[Ride Service]:Pickup and destination are required to calculate fare.");
    }

    const distanceTime = await getDistanceAndTime(pickup, destination);
    if (!distanceTime) {
        throw new Error("[Ride Service]:Could not calculate distance and time for fare calculation.");
    }
    const distanceKm = typeof distanceTime.distance === "number"
        ? distanceTime.distance / 1000 //convert to km
        : parseFloat(String(distanceTime.distance));
    const durationMin = (typeof distanceTime.duration === "number"
        ? distanceTime.duration / 60 //convert to minutes
        : parseFloat(String(distanceTime.duration))) / 60;

    if (!isFinite(distanceKm) || !isFinite(durationMin)) {
        throw new Error("[Ride Service]:Invalid distance or duration returned from maps service.");
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

function getOtp(num: number): string {
    return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
}

type VehicleType = 'auto' | 'car' | 'motorcycle';
export async function createRide(user: string, pickup: string, destination: string, vehicleType: VehicleType): Promise<any> {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("[Ride Service]:All parameters are required to create a ride.");
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

export async function confirmRide({ rideId, captainId }: { rideId: string; captainId: string }): Promise<any> {

    if (!rideId || !captainId) {
        throw new Error("[Ride Service]:Ride ID and Captain ID are required to confirm a ride.");
    }
    try {
        console.log('[Ride Service]: Confirming ride with rideId:', rideId, 'captainId:', captainId);

        const ride = await RideModel.findOneAndUpdate(
            { _id: rideId },
            { status: 'accepted', captain: captainId },
            { new: true }
        )
            .populate('user', 'fullName email socketId')  // ✅ Populate user
            .populate('captain', 'fullName vehicle')     // ✅ Populate captain
            .select('+otp')

        if (!ride) {
            throw new Error("[Ride Service]:Ride not found.");
        }

        console.log('[Ride Service]: Ride confirmed successfully:', ride);
        return ride;
    } catch (error: any) {
        console.error('[Ride Service]: Error confirming ride:', error.message);
        throw new Error(error.message);
    }
}

export async function startRideService({ rideId, otp, captain }: { rideId: string | undefined; otp: string | undefined; captain: ICaptain }): Promise<IRide> {
    if (!rideId || !otp) {
        throw new Error("[Ride Service]:Ride ID and OTP are required to start a ride.");
    }
    const ride = await RideModel.findOne({ _id: rideId });
    if (!ride) {
        throw new Error("[Ride Service]:Ride not found or invalid OTP.");
    }
    if (ride.status !== 'accepted') {
        throw new Error("[Ride Service]:Ride cannot be started. Current status: " + ride.status);
    }
    if (ride.otp !== otp) {
        throw new Error("[Ride Service]:Invalid OTP provided.");
    }

    try {
        const response = await RideModel.findOneAndUpdate({
            _id: rideId,
        }, {
            status: 'ongoing',
        })
            .populate('user', 'fullName email socketId')
            .populate('captain', 'fullName vehicle')
        if (!response) {
            throw new Error("[Ride Service]:Failed to start the ride.");
        }
        return response;

    } catch (error: any) {
        throw new Error("[Ride Service]:Error starting the ride: " + (error as Error).message);
        
    }
}

export async function endRideService({ rideId, captain }: { rideId: string | undefined; captain: ICaptain }): Promise<IRide> {
    if (!rideId) {
        throw new Error("[Ride Service]:Ride ID is required to end a ride.");
    }
    const ride = await RideModel.findOne({ _id: rideId }).populate('captain').populate('user');
    if (!ride) {
        throw new Error("[Ride Service]:Ride not found.");
    }
    if (ride.status !== 'ongoing') {
        throw new Error("[Ride Service]:Ride cannot be ended. Current status: " + ride.status);
    }
    try {
        const response = await RideModel.findOneAndUpdate({
            _id: rideId,
            captain: captain._id
        }, {
            status: 'completed',
        })
            .populate('user', 'fullName email socketId')
            .populate('captain', 'fullName vehicle')
        if (!response) {
            console.log("[Ride Service]:Failed to end the ride for rideId:", rideId);
            throw new Error("[Ride Service]:Failed to end the ride."+response);
        }
        console.log("[Ride Service]:Ride ended successfully ", response);
        return response;

    } catch (error: any) {
        console.error("[Ride Service]:Error ending the ride for rideId:", rideId, "Error:", error);
        console.log("[rideservice]"+error);
        throw new Error("[Ride Service]:Error ending the ride: " + (error as Error).message);
    }
}  
