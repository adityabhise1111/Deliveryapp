import express from "express";
import { Request, Response ,NextFunction} from "express";
import { authUser,authCaptain } from "../middlewares/auth.middleware";
import { getCoordinates } from "../controllers/map.controller";
import { query } from "express-validator";

const router = express.Router();

router.get('/get-coordinates',
    query('address').isString().isLength({min:3}).withMessage('Address query parameter is required'),
    authUser, getCoordinates);


export default router;