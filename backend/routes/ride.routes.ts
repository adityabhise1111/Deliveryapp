import express from "express";
import { Request, Response ,NextFunction} from "express";
import { authUser,authCaptain } from "../middlewares/auth.middleware";
import {body,query} from "express-validator";
import { createRideController,confirmRideController ,getFares,getOtp, startRideController } from "../controllers/ride.controller";


const router = express.Router();

router.post('/create' ,
    body('pickup').isString().withMessage('Pickup location is required'),
    body('destination').isString().withMessage('Destination is required'),
    body('vehicleType').isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicle type'),
    authUser,
    createRideController
)

router.post('/confirm',
    authCaptain,
    body('rideId').isMongoId().withMessage('invalid ride ID'),
    // body('captainId').isMongoId().withMessage('invalid captain ID:-'),
    confirmRideController
)

router.get('/get-fares',
    query('pickup').isString().withMessage('Pickup location is required'),
    query('destination').isString().withMessage('Destination is required'),
    authUser ,
    getFares
)

router.get('/get-otp',
    query('rideId').isMongoId().withMessage('invalid ride ID'),
    authUser ,
    getOtp
)

router.get('/start-ride',
    authCaptain,
    query('rideId').isMongoId().withMessage('invalid ride ID'),
    query('otp').isString().withMessage('OTP is required'),
    startRideController

)

export default router;