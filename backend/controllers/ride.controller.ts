import { validationResult } from "express-validator";
import { createRide, getFare } from "../services/ride.service";
import e, { Request, Response, NextFunction } from "express";
import { getAddressCoordinates, getCaptainsIntheRadius } from "../services/maps.service";
import { sendMessageToSocket } from "../services/socket";
import RideModel from "../model/ride.model";


interface RideRequestBody {
    userId: string;
    pickup: string;
    destination: string;
    vehicleType: 'auto' | 'car' | 'motorcycle';
}

export async function createRideController(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = (req as any).user._id;
        const { pickup, destination, vehicleType } = req.body as RideRequestBody;
        const ride = await createRide(userId, pickup, destination, vehicleType);
        ride.otp=""; // Hide OTP before sending to captains
        const pickupCoords = await getAddressCoordinates(pickup);
        console.log("[Ride Controller]:- Pickup coordinates:", pickupCoords);
        if (pickupCoords) {
            
            const nearbyCaptains = await getCaptainsIntheRadius(pickupCoords.lat, pickupCoords.lon, 5);
            console.log("[Ride Controller]:- Nearby captains found:", nearbyCaptains.length);
            console.log("[Ride Controller]:- Nearby captains details:", nearbyCaptains);

            const rideWithUser=await RideModel.findOne({_id:ride._id}).populate('user')

            if (nearbyCaptains.length) {
                nearbyCaptains.map(captain => {
                    if (captain.socketId) {
                        sendMessageToSocket(captain.socketId, {
                            event: "new-ride",
                            data: rideWithUser
                        });
                    } else {
                        console.warn(`[Ride Controller]:- Captain ${captain._id} has no socketId`);
                    }
                })
            }
        } else {
            console.log("[Ride Controller]:- Could not fetch pickup coordinates.");

        }


        return res.status(201).json(ride);


    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getFares(req: Request, res: Response, next: NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ erros: error.array() })
    }
    try {
        const { pickup, destination } = req.query;
        if (!pickup || !destination) {
            return res.status(400).json({ message: "Pickup and destination are required" });
        }

        const fares = await getFare(String(pickup), String(destination));
        if (!fares) {
            return res.status(404).json({ message: "Fares not found for the given locations ." });
        }
        console.log("fares", JSON.stringify(fares));
        return res.status(200).json({ fares });

    } catch (error: any) {
        console.error("Error in getFares controller:", error);
        return res.status(500).json({
            message: "Server error while fetching fares",
            error: error.message
        });
    }
}

