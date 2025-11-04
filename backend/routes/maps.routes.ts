import express from "express";
import { Request, Response ,NextFunction} from "express";
import { authUser,authCaptain } from "../middlewares/auth.middleware";
import { getCoordinates , getDistanceTime, getAutoCompleteSuggestions } from "../controllers/map.controller";

import { query } from "express-validator";


const router = express.Router();

// router.get('/get-coordinates',
//     query('address').isString().isLength({min:3}).withMessage('Address query parameter is required'),
//      getCoordinatess);

router.get('/get-coordinates',
    query('address').isString().isLength({min:3}).withMessage('Address query parameter is required'),
    authUser,
    getCoordinates
);
router.get('/get-distance-time',
    query('origin').isString().isLength({min:3}).withMessage('Origin query parameter is required'),
    query('destination').isString().isLength({min:3}).withMessage('Destination query parameter is required'),
    authUser,
    getDistanceTime
);
router.get('/get-suggestions',
    query('input').isString().isLength({min:1}).withMessage('Input query parameter is required'),
    authUser,
    getAutoCompleteSuggestions
)


export default router;