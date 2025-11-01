import { Link } from 'react-router-dom'
import uber from '../assets/uber.png'
import image from '../assets/image.png'
import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import { useRef, useState } from 'react';
import FinishRide from '../components/FinishRide';

const CaptainRiding: React.FC = () => {
    const [finishRidePanel, setfinishRidePanel] = useState<boolean>(false)
    const finishRideRef = useRef(null);
    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRideRef.current, {
                transform: 'translateY(0)',
                display: 'block'
            })
        } else {
            gsap.to(finishRideRef.current, {
                transform: 'translateY(100%)',
                display: 'hidden'
            })
        }
    }, [finishRidePanel]);
    return (
        <div className='h-screen relative'>
            <div className="fixed p-3 top 0 flex items-center justify-between w-screen ">
                <img className='w-16' src={uber} alt="" />
                <Link to='/captain-home' className="fixed h-10 w-10 bg-white flex items-center justify-center top-5 right-5 rounded-full shadow-lg">
                    <i className="text-lg font-bold ri-logout-box-r-line "></i>
                </Link>
            </div>
            <div className="h-4/5">
                <img className='h-full w-full object-cover' src={image} alt="" />
            </div>
            <div className="h-1/5 flex items-center justify-between relative bg-yellow-400 pt-10 p-6"
                 onClick={()=>{
                    setfinishRidePanel(true);
                }}>
                <h5 className='p-1 text-center w-[90%] absolute top-0'>
                    <i className="text-lg font-bold ri-arrow-up-wide-line "></i>
                </h5>
                <h4 className='text-xl font-semibold'>4 KM away</h4>
                <button className='bg-green-600 text-white font-semibold p-3 px-8 rounded-lg'>
                    Complete Ride
                </button>
            </div>
            <div ref={finishRideRef} className="fixed bottom-0 w-full translate-y-full bg-white z-10 rounded-t-3xl ">
                <FinishRide setfinishRidePanel={setfinishRidePanel} />
            </div>
        </div>
    )
}
export default CaptainRiding