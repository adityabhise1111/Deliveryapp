import mongoose from 'mongoose';


export async function connectToDB():Promise<void> { //async function always return promise; The connectToDB() function doesn't return any data, so its return type is void.
    try {
        await mongoose.connect(process.env.MONGO_URI as string); // process.env.MONGO_URI is a string.
        console.log("connected successfully")
        
    } catch (error) {
        console.error("Error connnecting db",error);
    }
}