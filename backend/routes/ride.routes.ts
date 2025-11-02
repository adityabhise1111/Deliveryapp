import express from "express";
import { Request, Response ,NextFunction} from "express";
import { authUser,authCaptain } from "../middlewares/auth.middleware";
import {body} from "express-validator";
import { createRideController } from "../controllers/ride.controller";


const router = express.Router();

router.post('/create' ,
    body('pickup').isString().withMessage('Pickup location is required'),
    body('destination').isString().withMessage('Destination is required'),
    body('vehicleType').isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicle type'),
    authUser,
    createRideController
  
)









export default router;