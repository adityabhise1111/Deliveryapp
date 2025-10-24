import React from 'react'
import { type Dispatch, type SetStateAction } from 'react';
import car from '../assets/car.png'

interface ConfirmRideProps {
  confirmRidePanel: boolean;
  setConfirmRidePanel: Dispatch<SetStateAction<boolean>>;
  setLookingForRidePanel: Dispatch<SetStateAction<boolean>>;
}

const ComfirmRide: React.FC<ConfirmRideProps> = (props) => {
  return (
    <div className='bg-white'>
      <h5
        onClick={() => {
          props.setConfirmRidePanel(false);
        }}
        className=" text-center  justify-centre items-center p-1">
        <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>
      <h3 className='text-2xl font-semibold mb-4  '> Confirm Your Vehicle</h3>

      <div className="confirmvehicle flex flex-col justify-between items-center ">
        <img src={car} alt="" className="vehicle" />
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
        <button onClick={()=>{
          props.setLookingForRidePanel(true);
          props.setConfirmRidePanel(false);
        }} className=' mt-5 w-full bg-green-500 text-white font-semibold p-2 rounded-lg px-3 py-8' >Confirm</button>
      </div>
    </div>
  )
}

export default ComfirmRide