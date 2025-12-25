import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
export interface IUser {
    _id: string;
    email: string;
    socketId: string;
    fullName: {
        firstName: string;
        lastName: string;
    };
}

export interface IRideData {
    _id: string;
    pickup: string;
    destination: string;
    fare: number;
    otp: string;
    status: string;
    captain: string;
    user: IUser;
    __v: number;
}
interface FinishRide {
    setfinishRidePanel: React.Dispatch<React.SetStateAction<boolean>>;
    setconfirmRidePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
    rideData: IRideData | undefined;
}
const FinishRide: React.FC<FinishRide> = (props) => {
    console.log('Ride Data in FinishRide:', props.rideData);
    const navigate = useNavigate();
    const endRide = async () => {
        // Logic to finish the ride can be added here
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
                    rideId: props.rideData?._id,
                    captain: props.rideData?.captain
                },{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
                
            );
            if (response.status !== 200) {
                console.error('Failed to finish ride:', response.data);
                alert('Failed to finish ride. Please try again.' + response.data.message);
                return;
            }
            console.log('Ride finished successfully: checkkk', response);
            alert('Ride finished successfully!' + response.data.message);
            props.setfinishRidePanel(false);
            // props.setconfirmRidePopUpPanel(false);
            navigate('/captain-home')
        } catch (error) {
            console.error('[FinishRide]:Error finishing ride:', error);
            alert('[FininshRidetsx]An error occurred while finishing the ride. Please try again.' + error);
        }
        console.log('[Finish ride.tsx]: Finish Ride button clicked');
    }
    return (
        <div>
            <div className="h-screen">
                <h5 onClick={() => {
                    props.setfinishRidePanel(false);
                }}
                    className=" text-center  justify-centre items-center p-1">
                    <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>
                <h3 className='text-2xl font-semibold mb-4  '>Finish Ride
                    <div onClick={() => {
                        props.setconfirmRidePopUpPanel(true);
                    }} className='flex items-center gap-3 justify-between mt-3  bg-yellow-400 rounded-lg p-3'>
                        <div className='flex object-center items-center gap-3'>
                            <img className='h-12 w-12 rounded-full ' alt="" />
                            <h5 className='text-xl font-semibold'>
                                {props.rideData?.user.fullName.firstName}{" "}
                                {props.rideData?.user.fullName.lastName}</h5>
                        </div>
                        <h5>3.4 KM</h5>
                    </div>
                </h3>



                <div className="confirmvehicle flex flex-col justify-between items-center ">
                    <img alt="" className="vehicle" />
                    <div className="details my-4 w-full mt-5">
                        <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                            <i className='text-lg ri-map-pin-2-fill'></i>
                            <div>
                                <h3 className='text-lg font-medium'>123/11-Ab</h3>
                                <p className='text-sm mt-1 text-gray-600 '>
                                    {props.rideData?.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                            <i className="ri-square-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>654/11-Ab</h3>
                                <p className='text-sm mt-1 text-gray-600 '>{props.rideData?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-wallet-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{props.rideData?.fare}</h3>
                                <p className='text-sm mt-1 text-gray-600 '>Cash</p>
                            </div>
                        </div>
                    </div>
                    <div className='w-full mt-6'>
                        <button onClick={endRide} className=' flex items-center justify-center mt-5 w-full bg-green-500 text-white font-semibold p-3 rounded-lg ' >
                            Finish Ridee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinishRide