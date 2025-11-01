import { validationResult } from "express-validator";
import { getAddressCoordinate } from "../services/maps.service";
import { Request, Response ,NextFunction} from "express";

export async function getCoordinates(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("[map.controller] getCoordinates called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("[map.controller] Validation errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const address = String(req.query.address);
    if (!address) {
        res.status(400).json({ message: "Address query parameter is required" });
        return;
    }
    try {
        const coordinates =  await getAddressCoordinate(address);
        if (!coordinates) {
            res.status(404).json({ message: "Coordinates not found for the given address" });
            return;
        }

        res.status(200).json({ coordinates });
    } catch (error) {
        console.error("[map.controller] Error in getCoordinates:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message || "Internal server error" });
            return;
        }
    }
    
}