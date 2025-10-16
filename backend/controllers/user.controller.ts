import { validationResult } from "express-validator";
import { Request, Response ,NextFunction} from "express";
import { createUser } from "../services/user.service";
import bcrypt from "bcrypt";
import userModel from "../model/user.model";
import blacklistTokenModel from "../model/blacklistToken.model";

export async function registerUser (req:Request , res:Response, next :NextFunction): Promise<void> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
    }

    const {firstName, lastName, email, password} = {
        ...req.body.fullName,
        email: req.body.email,
        password: req.body.password
    };
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await createUser(firstName, lastName, email, hashedPassword);
        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error:any) {
        console.error("Registration error:", error);
        
        if (error.code === 11000) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        
        res.status(500).json({ message: error.message || "Internal server error" });
    
    }


}

export async function loginUser (req:Request , res:Response, next :NextFunction): Promise<void> {
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
        const user = await userModel.findOne({email}).select("+password");
        if(!user) {
            res.status(401).json({message: "Invalid email or password"});
            return;
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            res.status(401).json({message: "Invalid email or password"});
            return;
        }
        const token = user.generateAuthToken();
        res.cookie("token", token);
        res.status(200).json({token, user});
        return;


    } catch (error:any) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
        return;
        
    }


}

export async function getUserProfile(req :Request , res:Response, next :NextFunction): Promise<void> {
    res.status(200).json({user: req.user});
    return;
}

export async function logoutUser(req: Request, res: Response): Promise<void> {
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