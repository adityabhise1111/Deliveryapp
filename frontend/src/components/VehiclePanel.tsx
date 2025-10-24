import React from 'react'
import moto from '../assets/moto.png'
import car from '../assets/car.png'
import auto from '../assets/auto.png'

interface vehiclePanelProps {
    setSelectedVehicle: React.Dispatch<React.SetStateAction<string | null>>;
    setVehiclePanel: React.Dispatch<React.SetStateAction<boolean>>;
    selectedVehicle?: string | null;
    setConfirmRidePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const VehiclePanel: React.FC<vehiclePanelProps> = (props) => {
    return (
        <div>
            <h5
                onClick={() => {
                    props.setVehiclePanel(false);
                }}
                className=" text-center  justify-centre items-center p-1">
                <i className="text-gray-200 text-3xl ri-arrow-down-wide-line "></i></h5>
            <h3 className='text-2xl font-semibold mb-4  '>Choose a Vehicle</h3>

            <div
                onClick={() => {
                    props.setConfirmRidePanel(true);
                    props.setVehiclePanel(false);
                    props.setSelectedVehicle('moto')
                }}
                className={`Car my-2 bg-white w-full flex border-2 ${props.selectedVehicle === 'moto' ? 'border-black' : 'border-transparent'} active:border-black items-center p-2 rounded-xl cursor-pointer`}>
                <img src={moto} alt="" className="Car w-20" />
                <div className="name m-5 w-1/2">
                    <h4 className='font-medium text-base'>Uber Moto <span><i className="ri-user-3-fill">4</i></span></h4>
                    <h5 className="distance font-medium text-sm">2 mins away</h5>
                    <p className="para font-normal text-xs">Affordable Compact Rides</p>
                </div>
                <h2 className="price text-2xl font-semibold">₹200</h2>
            </div>
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true);
                    props.setVehiclePanel(false);
                    props.setSelectedVehicle('auto')
                }}
                className={`Car my-2 bg-white w-full flex border-2 ${props.selectedVehicle === 'auto' ? 'border-black' : 'border-transparent'} active:border-black items-center p-2 rounded-xl cursor-pointer`}>
                <img src={auto} alt="" className="Car w-20" />
                <div className="name m-5 w-1/2">
                    <h4 className='font-medium text-base'>Uber Auto <span><i className="ri-user-3-fill">4</i></span></h4>
                    <h5 className="distance font-medium text-sm">2 mins away</h5>
                    <p className="para font-normal text-xs">Affordable Compact Rides</p>
                </div>
                <h2 className="price text-2xl font-semibold">₹200</h2>
            </div>
            <div
                onClick={() => {
                    props.setConfirmRidePanel(true);
                    props.setVehiclePanel(false);
                    props.setSelectedVehicle('car')
                }}
                className={`Car my-2 bg-white w-full flex border-2 ${props.selectedVehicle === 'car' ? 'border-black' : 'border-transparent'} active:border-black items-center p-2 rounded-xl cursor-pointer`}>
                <img src={car} alt="" className="Car w-20" />
                <div className="name m-5 w-1/2">
                    <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-3-fill">4</i></span></h4>
                    <h5 className="distance font-medium text-sm">2 mins away</h5>
                    <p className="para font-normal text-xs">Affordable Compact Rides</p>
                </div>
                <h2 className="price text-2xl font-semibold">₹200</h2>
            </div>
        </div>
    )
}

export default VehiclePanel