import mongoose from "mongoose";

export interface IRide extends mongoose.Document {
    user: mongoose.Types.ObjectId;
    captain?: mongoose.Types.ObjectId;
    pickup: string;
    destination: string;
    fare: number;
    status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
    duration?: number; // in sec
    distance?: number; // in meter
    paymentId?: string;
    orderId?: string;
    signature?: string;
}


const RiderSchema = new mongoose.Schema <IRide>({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
    },
    pickup:{
        type: String,
        required: true,
    },
    destination:{
        type: String,
        required: true,
    },
    fare:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    duration:{
        type: Number, // in sec
    },
    distance:{
        type: Number, // in meter
    },
    paymentId:{
        type: String,
    },
    orderId:{
        type: String,
    },
    signature:{
        type: String,
    }


})

const RideModel = mongoose.model('Ride', RiderSchema);

export default RideModel;