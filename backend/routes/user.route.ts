import express ,{ Request, Response } from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controller";
import { authUser } from "../middlewares/auth.middleware";




const router = express.Router();











router.post("/register",[
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("fullName.firstName").isLength({min: 3}).withMessage("First name must be at least 3 characters long"),
],
registerUser //if validation passes, call registerUser controller
)

















router.post("/login",[
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
],
loginUser //if validation passes, call loginUser controller
)

router.get('/' , (req:Request,res:Response)=> {
    res.send("hellow from user routes");
})

router.get('/profile' ,authUser, getUserProfile ) // Protected route, only accessible if authUser middleware passes

router.get('/logout' ,authUser, logoutUser )

export default router;