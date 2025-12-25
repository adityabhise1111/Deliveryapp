import { validationResult } from "express-validator";
import { createRide, confirmRide, getFare, startRideService, endRideService } from "../services/ride.service";
import e, { Request, Response, NextFunction } from "express";
import { getAddressCoordinates, getCaptainsIntheRadius } from "../services/maps.service";
import { sendMessageToSocket } from "../services/socket";
import RideModel from "../model/ride.model";
import { Socket } from "socket.io";
import { send } from "process";


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
        ride.otp = ""; // Hide OTP before sending to captains
        const pickupCoords = await getAddressCoordinates(pickup);
        console.log("[Ride Controller]:- Pickup coordinates:", pickupCoords);
        if (pickupCoords) {

            const nearbyCaptains = await getCaptainsIntheRadius(pickupCoords.lat, pickupCoords.lon, 5);
            console.log("[Ride Controller]:- Nearby captains found:", nearbyCaptains.length);
            console.log("[Ride Controller]:- Nearby captains details:", nearbyCaptains);

            const rideWithUser = await RideModel.findOne({ _id: ride._id }).populate('user')

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

export async function confirmRideController(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const rideId = req.body.rideId as string | undefined;
    const captainId = req.body.captainId as string | undefined;
    console.log('[Ride Controller]: confirmRideController called with body:', req.body);

    // ✅ Add error checking
    console.log('[Ride Controller]: confirmRideController called with:', { rideId, captainId });

    if (!rideId) {
        res.status(400).json({ message: "[Ride Controller]Ride ID is required" });
        return;
    }

    if (!captainId) {
        res.status(400).json({ message: "[Ride Controller]Captain ID is required :-" + captainId });
        return;
    }

    try {
        const ride = await confirmRide({ rideId, captainId });

        if (!ride) {
            res.status(404).json({ message: "[Ride Controller]Ride not found" });
            return;
        }

        console.log('[Ride Controller]: Ride confirmed successfully:', ride);

        // ✅ Check if user has socketId before sending message
        if (ride.user && ride.user.socketId) {
            console.log('[Ride Controller]: Sending ride-confirmed event to user socketId:', ride.user.socketId);
            sendMessageToSocket(ride.user.socketId, {
                event: "ride-confirmed",
                data: ride
            });
        } else {
            console.warn('[Ride Controller]: User socketId not available:', ride.user);
        }

        res.status(200).json({ message: "[Ride Controller]Ride confirmed successfully", ride });
        return;

    } catch (error: any) {
        console.error("[Ride Controller]: Error confirming ride:", error.message);
        res.status(500).json({
            message: "[Ride Controller]Internal server error",
            error: error.message
        });
        return;
    }
}

export async function getOtp(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { rideId } = req.query;
        if (!rideId) {
            return res.status(400).json({ message: "Ride ID is required" });
        }
        const ride = await RideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }
        const otp = ride.otp;
        if (!otp) {
            console.error("[Ride Controller]: OTP not found for ride:", ride);
            return res.status(404).json({ message: "OTP not found for this ride"+ride });
        }
        return res.status(200).json({message:"take your otp"+otp });

    } catch (error: any) {
        console.error("[Ride Controller]: Error getting OTP:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

}

export async function startRideController(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(!req.captain){
        return  res.status(401).json({message:"Unauthorized : Captain not found in request"});
    }
    const rideId = req.query.rideId as string | undefined;
    const otp = req.query.otp as string | undefined;
    
    try {
        const ride = await startRideService({rideId,otp , captain:req.captain});

        sendMessageToSocket(ride.user.socketId, {
            event: "ride-started",
            data: ride
        });
        return res.status(200).json({ message: "Ride started successfully", ride });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
        

}

export async function endRideController(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors in endRideController:', errors.array());
        console.log('Request body:', req.body);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { rideId } = req.body;
        if (!rideId) {
            console.error('[ride controller]: rideId is missing in request body');
            console.log('[ride controller]Request body:', req.body);
            return res.status(400).json({ message: 'rideId is required' });
        }
        const ride = await endRideService({ rideId, captain: req.captain  });
        if (!ride) {
            console.error('[ride controller]: Ride not found for rideId:', rideId);
            return res.status(404).json({ message: 'Ride not found' });
        }
        sendMessageToSocket(ride.user?.socketId, {
            event: "ride-ended",
            data: ride
        });
        console.log('[ride controller]: Ride ended successfully:', ride);
        return res.status(200).json({ message: 'Ride ended successfully', ride });
        
    } catch (error) {
        console.error('[ride controller]: Error in endRideController:', error);
        console.log('[ride controller]Request body at error time:', req.body);
        return res.status(500).json({ message: '[ride controller] Internal server error'+ error });
        
    }
}