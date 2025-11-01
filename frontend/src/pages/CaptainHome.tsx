import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import image from '../assets/image.png'
import uber from '../assets/uber.png'
import RidePopUp from '../components/RidePopUp'
import CaptainPanel from '../components/CaptainPanel'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'

const CaptainHome:React.FC = () => {
  const [ridePopUpPanel, setridePopUpPanel] = useState(true);
  const [confirmRidePopUpPanel, setconfirmRidePopUpPanel] = useState(false);

  const riderPopUpRef = useRef(null);
  const confirmRiderPopUpRef = useRef(null);

  useGSAP(function () {
    if (ridePopUpPanel) {
      gsap.to(riderPopUpRef.current, {
        transform: 'translateY(0)',
        display: 'block'
      })
    } else {
      gsap.to(riderPopUpRef.current, {
        transform: 'translateY(100%)',
        display: 'hidden'
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
        display: 'hidden'
      })
    }
  }, [confirmRidePopUpPanel]);
    
  return (
    <div className="h-screen">
      <div className="fixed p-3 top 0 flex items-center justify-between w-screen ">
        <img className='w-16' src={uber} alt="" />
        <Link to='/home' className="fixed h-10 w-10 bg-white flex items-center justify-center top-5 right-5 rounded-full shadow-lg">
        <i className="text-lg font-bold ri-logout-box-r-line "></i>
      </Link>
      </div>
      <div className="h-3/5">
        <img className='h-full w-full object-cover' src={image} alt="" />
      </div>
      <div className="h-2/5 p-4">
        {/* panels will go here */}
        <CaptainPanel/>
      </div>

      <div ref={riderPopUpRef}  className="Vehicle translate-Y-full bg-white fixed w-full z-10 bottom-0 px-3 py-8 rounded-2xl">
        <RidePopUp setridePopUpPanel={setridePopUpPanel} setconfirmRidePopUpPanel={setconfirmRidePopUpPanel}/>
      </div>
      <div ref={confirmRiderPopUpRef}  className="Vehicle translate-Y-full bg-white fixed w-full h-screen z-10 bottom-0 px-3 py-8 rounded-2xl  ">
        <ConfirmRidePopUp setconfirmRidePopUpPanel={setconfirmRidePopUpPanel} setridePopUpPanel={setridePopUpPanel}/>
      </div>
    </div>
  )
}

export default CaptainHome