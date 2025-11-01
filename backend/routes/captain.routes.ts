import express ,{ Request, Response } from "express";
import { body } from "express-validator";
import { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain } from "../controllers/captain.controller";
import { authUser, authCaptain } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register",[
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("fullName.firstName").isLength({min: 3}).withMessage("First name must be at least 3 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.plate").notEmpty().withMessage("Vehicle plate number is required"),
    body("vehicle.vehicleType").notEmpty().withMessage("Vehicle type is required"),
    body("vehicle.capacity").notEmpty().withMessage("Vehicle capacity is required"),
],
registerCaptain //if validation passes, call registerCaptain controller
)

router.post("/login",[
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
],
loginCaptain //if validation passes, call loginCaptain controller
)

router.get('/' , (req:Request,res:Response)=> {
    res.send("hellow from Captain routes");
})

router.get('/profile' ,authCaptain, getCaptainProfile ) // Protected route, only accessible if authUser middleware passes

router.get('/logout' ,authCaptain, logoutCaptain )

export default router;