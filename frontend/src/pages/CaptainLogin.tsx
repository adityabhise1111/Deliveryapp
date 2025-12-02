import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import axios, {type AxiosResponse} from 'axios';

interface CaptainLoginData {
    email: string;
    password: string;
}

const CaptainLogin: React.FC = () => {
    const navigate = useNavigate();
    const context = useContext(CaptainDataContext);
    if (!context) {
        throw new Error('CaptainLogin must be used within CaptainDataContext');
    }
    const { captain, setCaptain } = context;

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [captainData, setCaptainData] = useState<CaptainLoginData | {}>({});
    const [kapil, setkapil] = useState("")

    const submitHandler = async(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setCaptainData({
            email, password
        })
        const loginData: CaptainLoginData = {
            email,
            password
        };
        
        console.log('[CaptainLogin] Attempting login with:', { email, passwordLength: password.length });
        
        try {
            const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, loginData);
            
            console.log('[CaptainLogin] Login response:', response.status, response.data);
            
            if (response.status === 200) {
                const data = response.data;
                setCaptain(data.captain);
                localStorage.setItem('token', data.token);
                console.log('[CaptainLogin] Login successful, navigating to /home');
                navigate('/captain-home');
            }
            
            setEmail("");
            setPassword("");
        } catch (error: any) {
            console.error('[CaptainLogin] Full error object:', error);
            console.error('[CaptainLogin] Error response:', error.response);
            console.error('[CaptainLogin] Error response data:', error.response?.data);
            console.error('[CaptainLogin] Error status:', error.response?.status);
            
            const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
            console.error('[CaptainLogin] Final error message:', errorMessage);
            
            alert(errorMessage);
        }
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
                >Submit</Link>
            </div>
        </div>
    )
}

export default CaptainLogin