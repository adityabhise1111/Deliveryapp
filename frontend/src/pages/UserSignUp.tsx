import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface UserData {
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
}

const UserSignUp: React.FC = () => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userData, setUserData] = useState<UserData | {}>({});

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const newUserData: UserData = {
      fullName:{
        firstName: firstname,
        lastName
      },
      email, 
      password, 
    };
    
    setUserData(newUserData);
    console.log(newUserData);
    
    setEmail("");
    setPassword("");
    setFirstname("");
    setLastName("");
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
            className='bg-[#eeeeee] rounded px-4 mb-7 py-2 border w-full placeholder:text-base '
            required
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
            }}
            placeholder='Enter your password'
            type="password"
          />
          <button
            type="submit"
            className='bg-black text-white w-full py-3 rounded mt-2 text-xl'
          >Sign Up</button>
          <p className='text-center'> Already Have account &#63;<Link className='text-blue-800 ' to="/login"> Login</Link></p>
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

export default UserSignUp