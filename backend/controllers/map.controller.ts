import { validationResult } from "express-validator";
import { getAddressCoordinates,getDistanceAndTime, getSuggestions } from "../services/maps.service";
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
        const coordinates = await getAddressCoordinates(address);
        if (!coordinates) {
            res.status(404).json({ message: "Coordinates not found for the given address" });
            return;
        }

        res.status(200).json({ coordinates });
    } catch (error) {
        console.error("[map.controller] Error in getCoordinates:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message || "Internal server error" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export async function getDistanceTime(req: Request, res: Response, next: NextFunction): Promise<void> {

    console.log("[map.controller] getDistanceTime called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("[map.controller] Validation errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const origin = String(req.query.origin);
        const destination = String(req.query.destination);
        const result = await getDistanceAndTime(origin, destination);
        if (!result) {
            res.status(404).json({ message: "Could not calculate distance and time for the given locations" });
            return;
        }
        res.status(200).json({ distance: result.distance, duration: result.duration });

        
    } catch (error) {
        console.error("[map.controller] Error in getDistanceTime:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message || "Internal server error" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
        
    }

}

export async function getAutoCompleteSuggestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("[map.controller] getAutoCompleteSuggestions called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("[map.controller] Validation errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const input = String(req.query.input);
    if (!input) {
        res.status(400).json({ message: "Input query parameter is required" });
        return;
    }
    try {
        const suggestions = await getSuggestions(input);
        res.status(200).json({ suggestions });
    } catch (error) {
        console.error("[map.controller] Error in getAutoCompleteSuggestions:", error);
        if (error instanceof Error) {
            res.status(500).json({ message: error.message || "Internal server error" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}






// const apiip = Apiip(process.env.OPENCAGE_API_KEY || '');

// export async function getCoordinates(req: Request, res: Response, next: NextFunction): Promise<void> {
//     console.log("[map.controller] getCoordinates called");
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         console.log("[map.controller] Validation errors:", errors.array());
//         res.status(400).json({ errors: errors.array() });
//         return;
//     }

//     const address = String(req.query.address);
//     if (!address) {
    //         res.status(400).json({ message: "Address query parameter is required" });
//         return;
//     }
//     try {
//         const coordinates =  await getAddressCoordinate(address);
//         if (!coordinates) {
//             res.status(404).json({ message: "Coordinates not found for the given address" });
//             return;
//         }

//         res.status(200).json({ coordinates });
//     } catch (error) {
//         console.error("[map.controller] Error in getCoordinates:", error);
//         if (error instanceof Error) {
//             res.status(500).json({ message: error.message || "Internal server error" });
//             return;
//         }
//     }
    
// }
    


// export async function getCoordinatess(req: Request, res: Response, next: NextFunction): Promise<void> {
        //     try {
            //         const location = await apiip.getLocation();
            //         res.status(200).json(location);
            //     } catch (error) {
                //         console.error("[map.controller] Error in getCoordinatess:", error);
    //         res.status(500).json({ message: "Failed to get location data" });
    //     }
    // }//test