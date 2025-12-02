import React, { type ReactNode } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
import car from '../assets/car.png'
import moto from '../assets/moto.png'
import auto from '../assets/auto.png'

interface LookingForDriverProps {
  lookingForRidePanel: boolean;
  setLookingForRidePanel: Dispatch<SetStateAction<boolean>>;
  setWaitingForDriverPanel: Dispatch<SetStateAction<boolean>>;
  pickup: string | undefined;
  destination: string | undefined;
  selectedVehicle: string | undefined;
  fares: any;
}

const LookingForDriver:React.FC<LookingForDriverProps> =(props) => {
  const vehicle = props.selectedVehicle as string;
  
  let vehicleImage: ReactNode;
  if(props.selectedVehicle === 'car'){
    vehicleImage = <img src={car} alt="Car" className="vehicle" />
  }else if(props.selectedVehicle === 'motorcycle'){
    vehicleImage = <img src={moto} alt="Bike" className="vehicle" />
  }else if(props.selectedVehicle === 'auto'){
    vehicleImage = <img src={auto} alt="Auto" className="vehicle" />
  }

  return (
    <div className='bg-white'>
      <h3 className='text-2xl font-semibold mb-4  '> Looking for Vehicle</h3>

      <div className="confirmvehicle flex flex-col justify-between items-center ">
        {vehicleImage}
        <div className="details my-4 w-full mt-5">
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className='text-lg ri-map-pin-2-fill'></i>
            <div>
              <h3 className='text-lg font-medium'>{props.pickup?.split(",").at(0)}</h3>
              <p className='text-sm mt-1 text-gray-600 '>{props.pickup?.split(",").slice(1).join(" ")}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
            <i className="ri-square-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{props.destination?.split(",").at(0)}</h3>
              <p className='text-sm mt-1 text-gray-600 '>{props.destination?.split(",").slice(1).join(" ")}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-wallet-2-fill"></i>
            <div onClick={()=>{
                props.setLookingForRidePanel(false)
                props.setWaitingForDriverPanel(true)
              }}> {/* remove this its for testing only */} 
              <h3 className='text-3xl font-medium'>₹{props.fares[vehicle]}</h3>
              <p  className='text-sm mt-1 text-gray-600 '>Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default LookingForDriver