import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import image from '../assets/image.png'
import uber from '../assets/uber.png'
import RidePopUp from '../components/RidePopUp'
import CaptainPanel from '../components/CaptainPanel'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { CaptainDataContext } from '../context/CaptainContext'
import { SocketContext } from '../context/SocketContext'
import axios from 'axios'

interface Ride {
  _id: string;
  user: string; // User ID as string
  pickup: string;
  destination: string;
  fare: number;
  status: string;
  otp: string;
  vehicleType?: 'auto' | 'car' | 'motorcycle';
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const CaptainHome: React.FC = () => {
  const [ridePopUpPanel, setridePopUpPanel] = useState(false); // ✅ Changed to false initially
  const [confirmRidePopUpPanel, setconfirmRidePopUpPanel] = useState(false);
  const [ride, setRide] = useState<Ride | null>(null); // ✅ Store ride data with proper type

  const riderPopUpRef = useRef(null);
  const confirmRiderPopUpRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext) || { captain: null };

  useEffect(() => {
    if (captain && captain.user && captain.user._id) {
      socket.emit('join', { role: 'captain', userId: captain.user._id });
      console.log('[CaptainHome]: Sent join message with id', captain.user._id);
    } else {
      console.log('[CaptainHome]: Captain data is still loading or incomplete:', captain);
    }

    // ✅ Listen for new ride requests
    const handleNewRide = (data: any) => {
      console.log('[CaptainHome]: New ride request received:', data);
      setRide(data); // Store ride data
      setridePopUpPanel(true); // Show the popup
    };

    socket.on('new-ride', handleNewRide);

    // ✅ Location update interval
    const locationInterval = setInterval(() => {
      if (navigator.geolocation && captain?.user?._id) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('[CaptainHome]: Emitting location update', position.coords.latitude, ',', position.coords.longitude);

          socket.emit("locationUpdateCaptains", {
            userId: captain.user._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        });
      }
    }, 5000);

    // ✅ Cleanup
    return () => {
      socket.off('new-ride', handleNewRide);
      clearInterval(locationInterval);
    };
  }, [captain, socket]);

  useGSAP(function () {
    if (ridePopUpPanel) {
      gsap.to(riderPopUpRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(riderPopUpRef.current, {
        transform: 'translateY(100%)',
        display: 'none' // ✅ Fixed: 'hidden' is not valid
      })
    }
  }, [ridePopUpPanel]);

  useGSAP(function () {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRiderPopUpRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(confirmRiderPopUpRef.current, {
        transform: 'translateY(100%)',
        display: 'none' // ✅ Fixed: 'hidden' is not valid
      })
    }
  }, [confirmRidePopUpPanel]);

  async function confirmRide():Promise<Object | void> {
    const response = axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`,{
      rideId: ride?._id,
      captainId: captain?._id
    })
    setridePopUpPanel(false);
    setconfirmRidePopUpPanel(true);
    
  }

  return (
    <div className="h-screen">
      <div className="fixed p-3 top-0 flex items-center justify-between w-screen">
        <img className='w-16' src={uber} alt="" />
        <Link to='/captain-home' className="fixed h-10 w-10 bg-white flex items-center justify-center top-5 right-5 rounded-full shadow-lg">
          <i className="text-lg font-bold ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img className='h-full w-full object-cover' src={image} alt="" />
      </div>
      <div className="h-2/5 p-4">
        <CaptainPanel />
      </div>

      <div ref={riderPopUpRef} className="translate-y-full bg-white fixed w-full z-10 bottom-0 px-3 py-8 rounded-2xl">
        <RidePopUp 
          ride={ride}
          setridePopUpPanel={setridePopUpPanel} 
          setconfirmRidePopUpPanel={setconfirmRidePopUpPanel}
          confirmRide={confirmRide} 
        />
      </div>
      <div ref={confirmRiderPopUpRef} className="translate-y-full bg-white fixed w-full h-screen z-10 bottom-0 px-3 py-8 rounded-2xl">
        <ConfirmRidePopUp 
          ride={ride}
          setconfirmRidePopUpPanel={setconfirmRidePopUpPanel} 
          setridePopUpPanel={setridePopUpPanel} 
        />
      </div>
    </div>
  )
}

export default CaptainHome