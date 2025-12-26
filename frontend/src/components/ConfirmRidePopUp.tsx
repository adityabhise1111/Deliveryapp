import React, { useState } from 'react'
import travis_kalanick from '../assets/travis_kalanick.jpeg'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Ride {
    _id: string;
    user: {
        fullName: {
            firstName: string;
            lastName: string;
        };
    };
    pickup: string;
    destination: string;
    fare: number;
    status: string;
    otp: string;
}

interface ConfirmRidePopUpProps {
    setconfirmRidePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
    setridePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
    ride: Ride | null;
}

interface StartRideResponse {
    message: string;
    ride: {
        _id: string;
        user: {
            fullName: string;
            email: string;
            socketId: string;
        };
        pickup: string;
        destination: string;
        fare: number;
        status: string;
    };
}

const ConfirmRidePopUp: React.FC<ConfirmRidePopUpProps> = (props) => {
    const [otp, setotp] = useState<string>('');
    const navigate = useNavigate();
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {

        e.preventDefault();

        try {
            console.log('[ConfirmRidePopUp] Starting ride with:', { rideId: props.ride?._id, otp });
            const response = await axios.get<StartRideResponse>(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride?._id,
                    otp: otp,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('[ConfirmRidePopUp] Ride started successfully:', response.data);

            if (response.status === 200) {
                alert('Ride started successfully!');
                props.setconfirmRidePopUpPanel(false);
                props.setridePopUpPanel(false);
                navigate('/captain-riding', { state: { ride: response.data.ride } });
            }
            else {
                alert('[confirm ride popup]Failed to start ride. Please check the OTP and try again.');
                console.error('[confirm ride popup]Failed to start ride:', response.data);
                console.log('Response data:', response.data);

            }

        } catch (error: unknown) {
            console.error('Error starting ride:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert('Failed to start ride. Please check the OTP and try again. ' + errorMessage);

        }
    };
    return (
        <div>
            <h5 onClick={() => {
                props.setconfirmRidePopUpPanel(false);
            }}
                className=" text-center  justify-centre items-center p-1">
                <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>
            <h3 className='text-2xl font-semibold  '>Confirm Ride
                <div onClick={() => {
                    props.setconfirmRidePopUpPanel(true);
                }} className='flex items-center gap-3 justify-between mt-3  bg-yellow-400 rounded-lg p-3'>
                    <div className='flex object-center items-center gap-3'>
                        <img className='h-12 w-12 rounded-full ' src={travis_kalanick} alt="" />
                        <h5 className='text-xl font-semibold'>Travis Kalanickk</h5>
                    </div>
                    <h5>3.4 KM</h5>
                </div>
            </h3>



            <div className="confirmvehicle flex flex-col justify-between items-center ">
                <img alt="" className="vehicle" />
                <div className="details my- w-full mt-5">
                    <div className='flex items-center gap-5 p-1 border-b-2 border-gray-200'>
                        <i className='text-lg ri-map-pin-2-fill'></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm mt-1 text-gray-600 '>{props.ride?.pickup || 'N/A'}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="ri-square-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm mt-1 text-gray-600 '>{props.ride?.destination || 'N/A'}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-wallet-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare.toFixed(2) || '0.00'}</h3>
                            <p className='text-sm mt-1 text-gray-600 '>Cash</p>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <form
                        onSubmit={(e) => {
                            submitHandler(e);
                        }}
                    >
                        <input
                            onChange={(e) => {
                                setotp(e.target.value);
                            }}
                            value={otp}
                            className='bg-[#eee] px-6 py-4 text-lg mt-3 w-full font-mono rounded-lg'
                            type="number"
                            placeholder="Enter OTP"
                        />

                        {/* Button Row */}
                        <div className="flex items-center justify-between gap-4 mt-5">
                            <button
                                type='submit'
                                className='flex-1 bg-green-500 text-center text-white font-semibold p-3 rounded-lg'
                            >
                                Confirm
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    props.setconfirmRidePopUpPanel(false);
                                    props.setridePopUpPanel(false);
                                }}
                                className='flex-1 bg-red-600 text-white font-semibold p-3 rounded-lg'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default ConfirmRidePopUp