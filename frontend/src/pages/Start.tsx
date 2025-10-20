import React from 'react'
import { Link } from 'react-router-dom'

const Start: React.FC = () => {
  return (
    <div>
        <div className="bg-cover bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600)] pt-8 flex flex-col justify-between  h-screen w-full bg-red-400">
            <img className='w-16 ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='bg-white py-5 px-5 pb-7'>
                <h2 className='text-3xl font-bold'>Get Started with us</h2>
                <Link to={"/login"} className='flex justify-center bg-black text-white w-full py-3 rounded mt-2'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Start