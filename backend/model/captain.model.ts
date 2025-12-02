import mongoose, { Schema, Document } from 'mongoose';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

export interface ICaptain extends Document {
    fullName: {
        firstName: string;
        lastName: string;
    };
    email: string;
    password: string;
    socketId?: string;
    status: 'active' | 'inactive' | 'suspended';
    vehicle: {
        vehicleType: string;
        plate: string;
        color?: string;
        capacity?: string;
    };
    location: {
        lat: number;
        lng: number;
    };
    generateAuthToken(): String;
    comparePassword(password: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
}


const CaptainSchema = new Schema<ICaptain>({
    fullName:{
        firstName: {type: String, 
            required: true,
            minlength:[3, "First name must be at least 3 characters long"]
        },
        lastName: {type: String, 
            required: false,
            minlength:[3, "Last name must be at least 3 characters long"]
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength:[5, "Email must be at least 5 characters long"]
    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    socketId:{
        type: String,
    },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'inactive' },
    vehicle: {
        color:{
            type: String,
            required: true,
            minlength:[3, "Color must be at least 3 characters long"]
        },
        plate: {
            type: String,
            required: true,
            minlength:[3, "Plate number must be at least 3 characters long"]
        },
        capacity:{
            type: String,
            required: true,
            minlength:[1, "Capacity must be at least 1 characters long"]
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['bike', 'car', 'truck', 'motorcycle'],
        },
    },
    location:{
        ltd:{ type: Number },  // Keep as ltd since your DB already uses this
        lng:{ type: Number }
    }
});

// Add geospatial index for $geoWithin queries
CaptainSchema.index({ location: '2dsphere' });

CaptainSchema.methods.generateAuthToken = function(): String {
    const token = jwt.sign(
        {_id: this._id,},
        process.env.JWT_PRIVATE_KEY!,
        {expiresIn: '24h'}
    );
    return token;
}

CaptainSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
     
}

CaptainSchema.methods.hashPassword = async function(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
} 

export default mongoose.model<ICaptain>('Captain', CaptainSchema);