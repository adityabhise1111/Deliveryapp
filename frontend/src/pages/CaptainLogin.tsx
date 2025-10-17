import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface CaptainLoginData {
    email: string;
    password: string;
}

const CaptainLogin: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [captainData, setCaptainData] = useState<CaptainLoginData | {}>({});

    const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setCaptainData({
            email, password
        })
        setEmail("");
        setPassword("");
    }
    return (
        <div className='p-7 flex flex-col justify-between h-screen'>
            <div>
                <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <form onSubmit={submitHandler}>
                    <h3 className='text-2xl mb-2 '>What's your Email</h3>
                    <input
                        className='bg-[#eeeeee] rounded px-4 mb-7 py-2 border w-full placeholder:text-base '
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
                        className='bg-yellow-500 text-black w-full py-3 rounded mt-2 text-xl'
                    >Login</button>
                    <p className='text-center'>Wanna Join Fleet &#63;<Link className='text-blue-800 ' to="/captain-signup"> Create new account</Link></p>
                </form>
            </div>
            <div>
                <Link to={"/login"}
                    className='bg-black flex justify-center text-white w-full py-3 rounded mt-2 text-xl'
                >SignIn as User</Link>
            </div>
        </div>
    )
}

export default CaptainLogin