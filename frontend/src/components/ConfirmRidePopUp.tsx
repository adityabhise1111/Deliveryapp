import React, { useState } from 'react'
import travis_kalanick from '../assets/travis_kalanick.jpeg'
import { Link } from 'react-router-dom';

interface ConfirmRidePopUpProps {
    setconfirmRidePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
    setridePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmRidePopUp: React.FC<ConfirmRidePopUpProps> = (props) => {
    const [otp, setotp] = useState<number>(NaN);
    const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Add OTP verification logic here
    };
    return (
        <div>
            <h5 onClick={() => {
                props.setconfirmRidePopUpPanel(false);
            }}
                className=" text-center  justify-centre items-center p-1">
                <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>
            <h3 className='text-2xl font-semibold mb-4  '>Confirm Ride
                <div onClick={() => {
                    props.setconfirmRidePopUpPanel(true);
                }} className='flex items-center gap-3 justify-between mt-3  bg-yellow-400 rounded-lg p-3'>
                    <div className='flex object-center items-center gap-3'>
                        <img className='h-12 w-12 rounded-full ' src={travis_kalanick} alt="" />
                        <h5 className='text-xl font-semibold'>Travis Kalanick</h5>
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
                            <p className='text-sm mt-1 text-gray-600 '>Sawant Vasti , Baramati</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="ri-square-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>654/11-Ab</h3>
                            <p className='text-sm mt-1 text-gray-600 '>Sawant Vasti, Baramati</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-wallet-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹178.28</h3>
                            <p className='text-sm mt-1 text-gray-600 '>Cash</p>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <form onSubmit={(e)=>{
                        submitHandler(e);
                    }}>
                        <input onChange={(e)=>{
                            setotp(Number(e.target.value));
                        }} value={otp}  className='bg-[#eee] px-6 py-4 text-lg mt-3 w-full font-mono rounded-lg  ' type="number" placeholder='Enter OTP' />
                        <Link to='/captain-riding' className=' flex items-center justify-center mt-5 w-full bg-green-500 text-white font-semibold p-3 rounded-lg ' >
                            Confirm
                        </Link>
                        <button onClick={() => {
                            props.setconfirmRidePopUpPanel(false);
                            props.setridePopUpPanel(false);
                        }} className=' mt-5 w-full bg-red-600 text-white font-semibold p-3 rounded-lg' >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp