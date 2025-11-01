import { type Dispatch, type SetStateAction } from 'react';
import car from '../assets/car.png'

interface LookingForDriverProps {
  lookingForRidePanel: boolean;
  setLookingForRidePanel: Dispatch<SetStateAction<boolean>>;
  setWaitingForDriverPanel: Dispatch<SetStateAction<boolean>>;
}

const LookingForDriver:React.FC<LookingForDriverProps> =(props) => {
  return (
    <div className='bg-white'>
      <h3 className='text-2xl font-semibold mb-4  '> Looking for Vehicle</h3>

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
            <div onClick={()=>{
                props.setLookingForRidePanel(false)
                props.setWaitingForDriverPanel(true)
              }}> {/* remove this its for testing only */} 
              <h3 className='text-3xl font-medium'>₹178.28</h3>
              <p  className='text-sm mt-1 text-gray-600 '>Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default LookingForDriver