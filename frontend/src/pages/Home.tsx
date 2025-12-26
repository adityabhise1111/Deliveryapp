import React, { useState, useRef, useEffect, useContext } from 'react'
import LiveMap from '../components/LiveMap'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { type IRide as Ride } from '../components/WaitingForDriver';

export interface Fares {
  auto: number;
  motorcycle: number;
  car: number;
}

export interface RideEvent {
  event: string;
  data: Ride;
}


const Home: React.FC = () => {
  const [pickup, setPickup] = useState<string>('');
  const [destination, setDestination] = useState<string>("");
  const [panel, setPanel] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);
  const [vehiclePanel, setVehiclePanel] = useState<boolean>(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState<boolean>(false);
  const [lookingForRidePanel, setLookingForRidePanel] = useState<boolean>(false);
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState<boolean>(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<string>>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<string>>([])
  const [activeInput, setActiveInput] = useState<'pickup' | 'destination' | null>(null);
  const [fares, setFares] = useState<Fares>({ auto: 0, motorcycle: 0, car: 0 });
  const [isVehicleLoading, setIsVehicleLoading] = useState<boolean>(false);
  const [ride, setRide] = useState<Ride | null>(null); // ✅ ADD THIS

  const panelRef = useRef<HTMLDivElement>(null);
  const vehiclePanelRef = useRef<HTMLDivElement>(null);
  const panelCloseRef = useRef<HTMLHeadingElement>(null);
  const confirmRidePanelRef = useRef<HTMLDivElement>(null);
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const { socket } = useContext(SocketContext)

  const { sendMessage } = useContext(SocketContext)
  const { user } = useContext(UserDataContext) || { user: null };
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.user && user.user._id) {
      console.log('[Home ]: sending message with id', user.user._id);
      sendMessage('join', { role: 'user', userId: user.user._id });
    } else {
      console.log('User data is still loading or incomplete:', user);
    }
  }, [user, sendMessage]);

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = async (rideData: Ride) => {
      console.log('[Home]: Ride confirmed received:', rideData);
      setRide(rideData); // ✅ Store the ride data
      setLookingForRidePanel(false);
      setWaitingForDriverPanel(true);
    };

    socket.on('ride-confirmed', handleRideConfirmed);

    return () => {
      socket.off('ride-confirmed', handleRideConfirmed);
    };
  }, [socket]);
  const handleRideConfirmed = (rideData: Ride) => {
    console.log('[Home]: Ride confirmed received:', rideData);
    setRide(rideData); // ✅ Store the ride data
    setLookingForRidePanel(false);
    setWaitingForDriverPanel(true);
  };
  socket.on('ride-confirmed', handleRideConfirmed);

  socket.on('ride-started', (rideData: Ride) => {
    setWaitingForDriverPanel(false);
    console.log('[Home]: Ride started received:', rideData);
    // alert('Your ride has started!');
    navigate('/riding', { state: { ride: rideData } });
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }
  useGSAP(function () {
    if (panel) {
      gsap.to(panelRef.current, { height: '70%' })
      gsap.to(panelCloseRef.current, { opacity: 1 })
    } else {
      gsap.to(panelRef.current, { height: '0%' })
      gsap.to(panelCloseRef.current, { opacity: 0 })
    }
  }, [panel])

  useGSAP(function () {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: 'translateY(100%)',
        display: 'hidden'
      })
    }
  }, [vehiclePanel])

  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: 'translateY(100%)',
        display: 'hidden'
      })
    }
  }, [confirmRidePanel])

  useGSAP(function () {
    if (lookingForRidePanel) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)',
        display: 'none'
      })
    }
  }, [lookingForRidePanel])

  useGSAP(function () {
    if (waitingForDriverPanel) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)',
        display: 'none'
      })
    }
  }, [waitingForDriverPanel])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (pickup.length < 3) {
        setPickupSuggestions([]);
        return;
      }
      const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      try {
        const response = await axios.get(`${url}/maps/get-suggestions?input=${encodeURIComponent(pickup)}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );
        console.log('Pickup suggestions:', response.data);
        setPickupSuggestions(response.data.suggestions || []);

      } catch (error) {
        console.error('Error fetching pickup suggestions:', error);
        setPickupSuggestions([]);
      }
    };
    fetchSuggestions();

  }, [pickup])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (destination.length < 3) {
        setDestinationSuggestions([]);
        return;
      }
      const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      try {
        const response = await axios.get(`${url}/maps/get-suggestions?input=${encodeURIComponent(destination)}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );
        console.log('Destination suggestions:', response.data);
        setDestinationSuggestions(response.data.suggestions || []);

      } catch (error) {
        console.error('Error fetching destination suggestions:', error);
        setDestinationSuggestions([]);
      }
    };
    fetchSuggestions();

  }, [destination])

  interface FaresResponse {
    fares: Fares;
  }

  const findTrip = async () => {
    setVehiclePanel(true);
    setPanel(false);
    setIsVehicleLoading(true);

    try {
      const response = await axios.get<FaresResponse>(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/rides/get-fares?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

      if (!response.data?.fares || Object.keys(response.data.fares).length === 0) {
        alert("No fares found for the selected routes");
        return;
      }

      setFares(response.data.fares);
      console.log('Fares fetched:', response.data.fares);

    } catch (error: any) {
      console.error('Error fetching fares:', error);
      alert(error.response?.data?.message || 'Failed to fetch fares');
      setVehiclePanel(false);
    } finally {
      setIsVehicleLoading(false);
    }
  }

  const createRide = async (vehicleType: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/rides/create`,
        {
          pickup,
          destination,
          vehicleType
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Ride created:', response.data);
      setRide(response.data); // ✅ Store the created ride
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* <img className='top-5 left-5 w-16 absolute z-10' src={uber} alt="uber-logo" /> */}
      <div className="absolute inset-0 z-0" id='map' >
        {/* <img className="h-full w-full object-cover " src={image} alt="map" /> */}
        <LiveMap />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className={`bg-white h-[50%] p-5 ${panel ? ' ' : 'rounded-t-3xl'} relative z-30`}>
          <h4 className='text-3xl semi-bold'>Find a trip</h4>
          <h5 onClick={() => { setPanel(false) }} ref={panelCloseRef}
            className='top-6 right-5 absolute font-bold '><i className="ri-arrow-down-wide-line"></i></h5>
          <form onSubmit={submitHandler}>
            <div className="line absolute w-1 bg-gray-900 h-14 mt-6 mx-5  rounded-full"></div>
            <input
              onClick={() => { setPanel(true); setActiveInput('pickup'); }}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
                setActiveInput('pickup');
              }}
              onFocus={() => setActiveInput('pickup')}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg my-1 w-full '
              type="text" name=""
              placeholder='Add a pickup location' id="" />
            <input
              onClick={() => { setPanel(true); setActiveInput('destination'); }}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setActiveInput('destination');
              }}
              onFocus={() => setActiveInput('destination')}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg my-1 w-full' type="text" name="" placeholder='Enter Your Destination' id=""
            />
            <button className='bg-black text-lg text-white rounded-lg px-4 py-2 w-full'
              onClick={findTrip}
            >Find Trip</button>
          </form>
        </div>

        <div ref={panelRef} className='h-[0%]  bg-white z-30 '>
          <LocationSearchPanel
            setPanel={setPanel}
            setVehiclePanel={setVehiclePanel}
            pickupSuggestions={pickupSuggestions}
            destinationSuggestions={destinationSuggestions}
            setPickupSuggestions={setPickupSuggestions}
            setDestinationSuggestions={setDestinationSuggestions}
            pickup={pickup}
            destination={destination}
            setPickup={setPickup}
            setDestination={setDestination}
            activeInput={activeInput}
          />
        </div>


      </div>
      <div ref={vehiclePanelRef} className="Vehicle bg-white fixed w-full z-30 bottom-0 translate-y-full px-3 py-8 rounded-2xl">
        <VehiclePanel isLoading={isVehicleLoading} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} setSelectedVehicle={setSelectedVehicle} selectedVehicle={selectedVehicle} fares={fares} />
      </div>

      <div className="ConfirmRide bg-white fixed w-full z-30 bottom-0 translate-y-full px-3 py-8 rounded-2xl" ref={confirmRidePanelRef}>
        <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fares={fares} selectedVehicle={selectedVehicle} confirmRidePanel={confirmRidePanel} setConfirmRidePanel={setConfirmRidePanel} setLookingForRidePanel={setLookingForRidePanel} />
      </div>

      <div ref={vehicleFoundRef} className="lookingForRide bg-white fixed w-full z-30 bottom-0 translate-y-full px-3 py-8 rounded-2xl">
        <LookingForDriver
          lookingForRidePanel={lookingForRidePanel}
          setLookingForRidePanel={setLookingForRidePanel}
          setWaitingForDriverPanel={setWaitingForDriverPanel}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle || undefined}
          fares={fares}
        />
      </div>

      <div ref={waitingForDriverRef} className="lookingForRide bg-white fixed w-full z-30 bottom-0 translate-y-full px-3 py-8 rounded-2xl">
        <WaitingForDriver
          setWaitingForDriverPanel={setWaitingForDriverPanel}
          ride={ride}  // ✅ Now ride is defined
        />
      </div>
    </div>
  )
}

export default Home