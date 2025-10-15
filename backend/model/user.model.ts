import mongoose,{Document , Schema} from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

interface IUserMethods{
    generateAuthToken(): String;
    comparePassword(password: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
}

export interface IUser extends Document , IUserMethods {
    fullName: {
        firstName: string;
        lastName: string;
    };
    email: string;
    password: string;
    socketId?: string;
}


const userSchema = new Schema<IUser>({
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
})


userSchema.methods.generateAuthToken = function(): String {
    const token = jwt.sign(
        {_id: this._id,},
        process.env.JWT_PRIVATE_KEY!
    );
    return token;
}

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
     
}

userSchema.methods.hashPassword = async function(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}  

const userModel = mongoose.model <IUser> ('user', userSchema);

export default userModel;