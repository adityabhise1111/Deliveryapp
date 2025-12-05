import React, { useState } from 'react'
import car from '../assets/car.png'

export interface ICaptain extends IUser {

    status: 'active' | 'inactive' | 'suspended';
    vehicle: {
        vehicleType: string;
        plate: string;
        color?: string;
        capacity?: string;
    };
    location?: {
        lat: number;
        lng: number;
    };
}
export interface IUser {
    fullName: {
        firstName: string;
        lastName: string;
    };
    email?: string;
    password?: string;
    socketId?: string;
}

export interface IRide {
    _id: string;
    user?: IUser;
    pickup: string;
    destination: string;
    fare: number;
    status: string;
    otp: string;
    vehicleType?: 'auto' | 'car' | 'motorcycle';
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    captain?: ICaptain;
}


interface WaitingForDriverProps {
    setWaitingForDriverPanel: React.Dispatch<React.SetStateAction<boolean>>;
    ride: IRide | null;
}
const WaitingForDriver: React.FC<WaitingForDriverProps> = (props) => {
    if (!props.ride) {
        return (
            <div className='bg-white p-4'>
                <h3 className='text-lg font-semibold'>Loading driver details...</h3>
            </div>
        );
    }
    const captainName = props.ride?.captain?.fullName?.firstName + " " + props.ride?.captain?.fullName?.lastName || 'Driver';
    const captainVehicle = props.ride?.captain?.vehicle?.plate || 'Vehicle';
    const pickup = props.ride?.pickup || 'Pickup Location';
    const destination = props.ride?.destination || 'Destination Location';
    const fare = props.ride?.fare || 0;
    const otp = props.ride?.otp || 'N/A';
    

    return (
        <div className='bg-white'>
            <h5
                onClick={() => {
                    props.setWaitingForDriverPanel(false);
                }}
                className=" text-center  justify-centre items-center p-1">
                <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>

            <div className='flex items-center justify-between    '>
                <img src={car} alt="" className="vehicle h-12" />
                <div className='text-right'>
                    <h2 className='text-lg font-medium'>{captainName}</h2>
                    <h3 className='text-xl font-semibold -mt-2 -mb-1' >{captainVehicle}</h3>
                    <p className='text-sm text-gray-600'>Mercedes Benz GLC</p>
                </div>
            </div>
            <div className="confirmvehicle flex flex-col justify-between items-center ">
                <div className="details my-4 w-full mt-5">
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className='text-lg ri-map-pin-2-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>OTP</h3>
                            <p className='text-sm mt-1 text-gray-600 '>{otp}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className='text-lg ri-map-pin-2-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>123/11-Ab</h3>
                            <p className='text-sm mt-1 text-gray-600 '>{pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="ri-square-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>654/11-Ab</h3>
                            <p className='text-sm mt-1 text-gray-600 '>{destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-wallet-2-fill"></i>
                        <div>
                            <h3 className='text-3xl font-medium'>{ fare}</h3>
                            <p className='text-sm mt-1 text-gray-600 '>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default WaitingForDriver