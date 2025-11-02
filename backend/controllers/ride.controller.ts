import { validationResult } from "express-validator";
import { createRide } from "../services/ride.service";
import { Request, Response, NextFunction } from "express";
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
        const {pickup, destination, vehicleType } = req.body as RideRequestBody;
        const ride = await createRide(userId, pickup, destination, vehicleType);
        return res.status(201).json(ride);
    } catch (error:any) {
        return res.status(500).json({ message: error.message });
    }
}