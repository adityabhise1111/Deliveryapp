import React from 'react'
import image from '../assets/image.png'
import car from '../assets/car.png'
import { Link } from 'react-router-dom'


const Riding:React.FC = () => {
  return (
    <div className="h-screen">
      <Link to='/home' className="fixed h-10 w-10 bg-white flex items-center justify-center top-5 right-5 rounded-full shadow-lg">
        <i className="text-lg font-bold ri-home-5-line"></i>
      </Link>
      <div className="h-1/2">
        <img className='h-full w-full object-cover' src={image} alt="" />
      </div>
      <div className="h-1/2 p-4">
        {/* panels will go here */}
        <div className='bg-white'>
            <div className='flex items-center justify-between  p-2  '>
                <img src={car} alt="" className="vehicle h-20 " />
                <div className='text-right'>
                    <h2 className='text-lg font-medium'>Aditya</h2>
                    <h3 className='text-xl font-semibold -mt-2 -mb-1' >MH14 AB 1234</h3>
                    <p className='text-sm text-gray-600'>Mercedes Benz GLC</p>
                </div>
            </div>
            <div className="confirmvehicle flex flex-col justify-between items-center ">
                <div className="details my-4 w-full mt-5">
                    
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
                            <h3 className='text-3xl font-medium'>₹178.28</h3>
                            <p className='text-sm mt-1 text-gray-600 '>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button className='mt-5 w-full bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a payment</button>
      </div>
    </div>
  )
}

export default Riding