import React from 'react'
import travis_kalanick from '../assets/travis_kalanick.jpeg'

interface RidePopUp {
    setridePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
    setconfirmRidePopUpPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const RidePopUp: React.FC<RidePopUp> = (props) => {
    return (
        <div>
            <h5 onClick={() => {
                props.setridePopUpPanel(false);
            }}
                className=" text-center  justify-centre items-center p-1">
                <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>
            <h3 className='text-2xl font-semibold mb-4  '> New Ride Available!
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
                <div className="flex gap-3 w-full">
                    <button onClick={() => {
                        props.setconfirmRidePopUpPanel(true);
                    }} className=' mt-5 w-full bg-green-500 text-white font-semibold p-3 rounded-lg ' >
                        Accept
                    </button>
                    <button onClick={() => {
                        props.setridePopUpPanel(false);
                    }} className=' mt-5 w-full bg-gray-200 text-black font-semibold p-3 rounded-lg ' >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp