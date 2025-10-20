import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import blacklistTokenModel from "../model/blacklistToken.model";
import captainModel from "../model/captain.model";
import { createCaptain } from "../services/captain.service";


export async function registerCaptain(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("Captain Registration called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { fullName, email, password, vehicle } = req.body;
    const isEmailExist = await captainModel.findOne({ email });
    if (isEmailExist) {
        console.log("Email already exists:", email);
        res.status(400).json({ message: "Email already exists" });
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const captain = await createCaptain({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity
        }
        );
        const token = captain.generateAuthToken();
        console.log("Captain registered successfully:", captain.email);

        res.status(201).json({ token, captain });
    } catch (error: any) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }

        res.status(500).json({ message: error.message || "Internal server error" });

    }


}

export async function loginCaptain(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log("Captain Login called");
    console.log("Request body:", req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { email, password } = {
        email: req.body.email,
        password: req.body.password
    };

    console.log("Login attempt for email:", email);

    try {
        const captain = await captainModel.findOne({ email }).select("+password");
        if (!captain) {
            console.log("Captain not found for email:", email);
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        console.log("Captain found:", captain.email);
        
        const isMatch = await captain.comparePassword(password);
        console.log("Password match result:", isMatch);
        
        if (!isMatch) {
            console.log("Password mismatch for email:", email);
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = captain.generateAuthToken();
        res.cookie("token", token);
        console.log("Login successful for:", email);
        res.status(200).json({ token, captain });
        return;


    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
        return;

    }


}

export async function getCaptainProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(200).json({ user: req.captain });
    return;
}

export async function logoutCaptain(req: Request, res: Response): Promise<void> {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "No token provided." });
        return;
    } else {
        await blacklistTokenModel.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
    return;
}