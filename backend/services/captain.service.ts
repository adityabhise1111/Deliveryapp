import captainModel, {ICaptain} from "../model/captain.model.ts";
import { Request, Response ,NextFunction} from "express";

interface ICaptainData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    color: string;
    plate: string;
    capacity: string;
    vehicleType: string;
}

export async function createCaptain(data:ICaptainData): Promise<ICaptain> {
    const { 
        firstName, 
        lastName, 
        email, 
        password, 
        color, 
        plate, 
        capacity, 
        vehicleType 
    } = data;
    try {
        if(!firstName || !email || !password || !color || !plate || !capacity || !vehicleType) {
       
            throw new Error("Missing fields");
        }
        const user = await captainModel.create({
            fullName: {
                firstName,
                lastName,
            },
            email,
            password,
            vehicle: {
                color,
                plate,
                capacity,
                vehicleType
            },
        });
        return user ;
        
    } catch (error) {
        throw error;
    }
    
}