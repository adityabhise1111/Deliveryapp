import { validationResult } from "express-validator";
import { Request, Response ,NextFunction} from "express";
import bcrypt from "bcrypt";
import blacklistTokenModel from "../model/blacklistToken.model";
import captainModel from "../model/captain.model";
import { createCaptain } from "../services/captain.service";


export async function registerCaptain (req:Request , res:Response, next :NextFunction): Promise<void> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }

    const {fullName, email, password , vehicle} = req.body;
    const isEmailExist = await captainModel.findOne({email});
    if(isEmailExist) {
        res.status(400).json({message: "Email already exists"});
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const captain = await createCaptain({
            firstName : fullName.firstName, 
            lastName:fullName.lastName, 
            email, 
            password:hashedPassword,
            color:vehicle.color,
            plate:vehicle.plate,
            vehicleType:vehicle.vehicleType,
            capacity:vehicle.capacity
    }
    );
        const token = captain.generateAuthToken();

        res.status(201).json({ token, captain });
    } catch (error:any) {
        console.error("Registration error:", error);
        
        if (error.code === 11000) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        
        res.status(500).json({ message: error.message || "Internal server error" });
    
    }


}

export async function loginCaptain (req:Request , res:Response, next :NextFunction): Promise<void> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }

    const { email, password} = {
        email: req.body.email,
        password: req.body.password
    };


    try {
        const captain = await captainModel.findOne({email}).select("+password");
        if(!captain) {
            res.status(401).json({message: "Invalid email or password"});
            return;
        }
        const isMatch = await captain.comparePassword(password);
        if(!isMatch) {
            res.status(401).json({message: "Invalid email or password"});
            return;
        }
        const token = captain.generateAuthToken();
        res.cookie("token", token);
        res.status(200).json({token, captain});
        return;


    } catch (error:any) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
        return;
        
    }


}

export async function getCaptainProfile(req :Request , res:Response, next :NextFunction): Promise<void> {
    res.status(200).json({user: req.captain});
    return;
}

export async function logoutCaptain(req: Request, res: Response): Promise<void> {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "No token provided." });
        return;
    }else{
        await blacklistTokenModel.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
    return;
}