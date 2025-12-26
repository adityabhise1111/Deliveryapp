import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios, { type AxiosResponse } from 'axios';





type VehicleType = 'car' | 'bike' | 'motorcycle' | 'truck';
interface CaptainData {
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
  vehicle: {
    color: string;
    plate: string;
    capacity: string;
    vehicleType: VehicleType;
  };
}





const CaptainSignUp: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error('UserSignUp must be used within UserContextProvider');
  }
  const { setCaptain } = context;
  console.log("[CaptainSignUp] Rendering CaptainSignUp component");

  const [firstname, setFirstname] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [vehicleColor, setVehicleColor] = useState<string>("");
  const [vehiclePlate, setVehiclePlate] = useState<string>("");
  const [vehicleCapacity, setVehicleCapacity] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<VehicleType | "">("");

  const [, setCaptainData] = useState<CaptainData | {}>({});

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    const newCaptainData: CaptainData = {
      fullName: {
        firstName: firstname,
        lastName
      },
      email,
      password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType as VehicleType
      }
    };

    console.log("New Captain Data:", newCaptainData);

    const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptainData);

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);

      navigate('/home');
    }

    setCaptainData(newCaptainData);
    console.log(newCaptainData);

    setEmail("");
    setPassword("");
    setFirstname("");
    setLastName("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  }

  return (
    <div className='p-7 flex flex-col justify-between h-screen'>
      <div>

        <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
        <form onSubmit={submitHandler}>
          <div >
            <h3 className='text-2xl mb-2 '>What's your Name</h3>
            <div className='flex gap-4 mb-5'>
              <input
                className='bg-[#eeeeee] rounded px-4  py-2 border w-full placeholder:text-base '
                required
                value={firstname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFirstname(e.target.value)
                }}
                placeholder='First Name'
                type="text"
              />
              <input
                className='bg-[#eeeeee] rounded px-4  py-2 border w-full placeholder:text-base '
                required
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLastName(e.target.value)
                }}
                placeholder='Last Name'
                type="text"
              />
            </div>
          </div>
          <h3 className='text-2xl mb-2 '>What's your Email</h3>
          <input
            className='bg-[#eeeeee] rounded px-4 mb-5 py-2 border w-full placeholder:text-base '
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
            }}
            placeholder='example@email.com'
            type="email"
          />
          <h3 className='text-2xl mb-2 '>Enter Password</h3>
          <input
            className='bg-[#eeeeee] rounded px-4 mb-5 py-2 border w-full placeholder:text-base '
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
            }}
            placeholder='Enter your password'
            type="password"
          />

          <h3 className='text-2xl mb-2 '>Vehicle Information</h3>

          <div className='flex gap-4 mb-5'>
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 placeholder:text-base '
              required
              value={vehicleColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setVehicleColor(e.target.value)
              }}
              placeholder='Vehicle Color'
              type="text"
            />
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 placeholder:text-base '
              required
              value={vehiclePlate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setVehiclePlate(e.target.value)
              }}
              placeholder='Vehicle Plate'
              type="text"
            />
          </div>

          <div className='flex gap-4 mb-7'>
            <input
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 placeholder:text-base '
              required
              value={vehicleCapacity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setVehicleCapacity(e.target.value)
              }}
              placeholder='Vehicle Capacity'
              type="number"
              min="1"
            />
            <select
              className='bg-[#eeeeee] rounded px-4 py-2 border w-1/2 placeholder:text-base '
              required
              value={vehicleType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setVehicleType(e.target.value as VehicleType)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="truck">Truck</option>
            </select>
          </div>

          <button
            type="submit"
            className='bg-black text-white w-full py-3 rounded mt-2 text-xl'
          >Sign Up as Captain</button>
          <p className='text-center'> Already Have account &#63;<Link className='text-blue-800 ' to="/captain-login"> Login as Captain</Link></p>
        </form>
      </div>
      <div>
        <p className='text-[10px]'>
          By signing up, you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default CaptainSignUp