import React, { use, useContext, useEffect } from 'react'
import image from '../assets/image.png'
import car from '../assets/car.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

export interface ICaptain {
  _id: string;
  email: string;
  socketId: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  vehicle: {
    capacity: string
    color: string
    plate: string
    vehicleType: string
  };
}
export interface IUser {
  _id: string;
  email: string;
  socketId: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
}

export interface IRiding {
  _id: string;
  pickup: string;
  destination: string;
  fare: number;
  otp: string;
  status: string;
  captain: ICaptain;
  user: IUser;
  __v: number;
}
const Riding: React.FC<IRiding> = (props) => {
  const location = useLocation();
  const rideData = location.state?.ride as IRiding;
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = (data: IRiding) => {
      console.log('[Riding Page]: Ride ended event received:', data);
      alert('Ride has ended.');
      navigate('/home');
    };

    console.log('[Riding Page]: Socket initialized with ID:', socket.id);
    socket.on('ride-ended', handleRideEnded);

    // ✅ CLEANUP: Remove listener when component unmounts or dependencies change
    return () => {
      socket.off('ride-ended', handleRideEnded);
    };
  }, [socket, navigate]);



  console.log('Riding page location state:', location.state);
  console.log('Ride Data in Riding page:', rideData);
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
              <h2 className='text-lg font-medium'>{rideData.captain?.fullName.firstName}</h2>
              <h3 className='text-xl font-semibold -mt-2 -mb-1' >{ }</h3>
              <p className='text-sm text-gray-600'>{rideData.captain?.vehicle.vehicleType}</p>
            </div>
          </div>
          <div className="confirmvehicle flex flex-col justify-between items-center ">
            <div className="details my-4 w-full mt-5">

              <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                <i className="ri-square-fill"></i>
                <div>
                  <h3 className='text-lg font-medium'>654/11-Ab</h3>
                  <p className='text-sm mt-1 text-gray-600 '>{rideData.destination}</p>
                </div>
              </div>
              <div className='flex items-center gap-5 p-3'>
                <i className="ri-wallet-2-fill"></i>
                <div>
                  <h3 className='text-3xl font-medium'>₹{rideData.fare}</h3>
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