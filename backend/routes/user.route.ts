import express ,{ Request, Response } from "express";
import { body } from "express-validator";
import { registerUser } from "../controllers/user.controller";
const router = express.Router();


router.post("/register",[
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body("fullName.firstName").isLength({min: 3}).withMessage("First name must be at least 3 characters long"),
],
registerUser //if validation passes, call registerUser controller
)

router.get('/' , (req:Request,res:Response)=> {
    res.send("hellow from user routes");
})


export default router;