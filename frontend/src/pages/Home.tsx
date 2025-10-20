import React from 'react'
import image from '../assets/image.png'
import uber from '../assets/uber.png'

const Home = () => {
  return (
    <div className='h-screen relative'>
      <img className='top-5 left-5 w-16 absolute' src={uber} alt="uber-logo" />
      <div className="h-screen w-screen" >
        <img className="h-full w-full object-cover " src={image} alt="map" />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className='bg-white h-[30%] p-5'>
          <h4 className='text-3xl semi-bold'>Find a trip</h4>
          <form >
              <input className='bg-[#eee] px-8 py-2 text-base rounded-lg my-1 w-full ' type="text" name="" placeholder='Add a pickup location' id="" />
              <input className='bg-[#eee] px-12 py-2 text-base rounded-lg my-1 w-full' type="text" name="" placeholder='Enter Your Destination' id="" />
          </form>
        </div>
        <div className='h-[70%] bg-amber-800 p-5 hidden'>

        </div>
      </div>
    </div>
  )
}

export default Home