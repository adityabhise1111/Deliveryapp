import React, { useState, useRef } from 'react'
import image from '../assets/image.png'
import uber from '../assets/uber.png'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'

const Home: React.FC = () => {
  const [pickup, setPickup] = useState<string>('');
  const [destination, setDestination] = useState<string>("");
  const [panel, setPanel] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehiclePanel, setVehiclePanel] = useState<boolean>(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState<boolean>(false);
  const [lookingForRidePanel, setLookingForRidePanel] = useState<boolean>(false);
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState<boolean>(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const vehiclePanelRef = useRef<HTMLDivElement>(null);
  const panelCloseRef = useRef<HTMLHeadingElement>(null);
  const confirmRidePanelRef = useRef<HTMLDivElement>(null);
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

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
        display: 'hidden'
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
        display: 'hidden'
      })
    }
  }, [waitingForDriverPanel])

  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='top-5 left-5 w-16 absolute' src={uber} alt="uber-logo" />
      <div className="h-screen w-screen" >
        <img className="h-full w-full object-cover " src={image} alt="map" />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full ">
        <div className={`bg-white h-[30%] p-5 ${panel ? ' ' : 'rounded-t-3xl'}`}>
          <h4 className='text-3xl semi-bold'>Find a trip</h4>
          <h5 onClick={() => { setPanel(false) }} ref={panelCloseRef}
            className='top-6 right-5 absolute font-bold'><i className="ri-arrow-down-wide-line"></i></h5>
          <form onSubmit={submitHandler}>
            <div className="line absolute w-1 bg-gray-900 h-14 mt-6 mx-5  rounded-full"></div>
            <input
              onClick={() => setPanel(true)}
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value)
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg my-1 w-full '
              type="text" name=""
              placeholder='Add a pickup location' id="" />
            <input
              onClick={() => setPanel(true)}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value)
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg my-1 w-full' type="text" name="" placeholder='Enter Your Destination' id="" />
          </form>
        </div>

        <div ref={panelRef} className='h-[0%] bg-white '>
          <LocationSearchPanel setPanel={setPanel} setVehiclePanel={setVehiclePanel} />
        </div>


      </div>
      <div ref={vehiclePanelRef} className="Vehicle bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-8 rounded-2xl">
        <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} setSelectedVehicle={setSelectedVehicle} selectedVehicle={selectedVehicle} />
      </div>

      <div className="ConfirmRide bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-8 rounded-2xl" ref={confirmRidePanelRef}>
        <ConfirmRide confirmRidePanel={confirmRidePanel} setConfirmRidePanel={setConfirmRidePanel} setLookingForRidePanel={setLookingForRidePanel} />
      </div>

      <div ref={vehicleFoundRef} className="lookingForRide bg-white fixed w-full z-10 bottom-0 translate-y-full px-3 py-8 rounded-2xl">
        <LookingForDriver lookingForRidePanel={lookingForRidePanel} setLookingForRidePanel={setLookingForRidePanel} setWaitingForDriverPanel={setWaitingForDriverPanel} />
      </div>

      <div ref={waitingForDriverRef} className="lookingForRide bg-white fixed w-full z-10 bottom-0 px-3 py-8 rounded-2xl">
        <WaitingForDriver setWaitingForDriverPanel={setWaitingForDriverPanel} />
      </div>
    </div>
  )
}

export default Home