import userModel, {IUser} from "../model/user.model.ts";

import { Request, Response ,NextFunction} from "express";

export async function createUser(firstName:string , lastName:string, email:string, password: string): Promise<IUser> {
    try {
        if(!firstName ) {
            throw new Error("Missing firstName fields");
        }
        if(!email ) {
            throw new Error("Missing email fields");
        }
        if( !password) {
            throw new Error("Missing password fields");
        }
        const user = await userModel.create({
            fullName: {
                firstName,
                lastName,
            },
            email,
            password,
        });
        return user ;
        
    } catch (error) {
        throw error;
    }
    
}