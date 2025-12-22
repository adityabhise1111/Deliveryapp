import { Request, Response, NextFunction } from "express";
import jwt, { JwtHeader } from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../model/user.model";
import blacklistTokenModel from "../model/blacklistToken.model";
import captainModel from "../model/captain.model";
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            user?: InstanceType<typeof userModel>;
            captain?: InstanceType<typeof captainModel>; // Add this line
        }
    }
}



export async function authUser(req: Request, res: Response, next: NextFunction): Promise<NextFunction | void> {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        res.status(401).json({ message: "Token has been revoked." });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
        if (typeof decoded === 'string') {
            throw new Error('Invalid token format');
        }

        if (!decoded._id) {
            throw new Error('Token missing user ID');
        }

        const user = await userModel.findById(decoded._id);
        if (!user) {
            res.status(401).json({ message: "User not found." });
            return;
        }
        req.user = user;
        return next(); // Don't forget to call next()!

    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
        return;

    }
}

export async function authCaptain(req: Request, res: Response, next: NextFunction): Promise<NextFunction | void> {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        res.status(401).json({ message: "Token has been revoked." });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
        if (typeof decoded === 'string') {
            throw new Error('Invalid token format');
        }

        if (!decoded._id) {
            throw new Error('Token missing user ID');
        }

        const captain = await captainModel.findById(decoded._id);
        if (!captain) {
            res.status(401).json({ message: "[auth.middleware] captain not found." });
            return;
        }
        req.captain = captain;
        return next(); // Don't forget to call next()!

    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
        return;
    }
}

