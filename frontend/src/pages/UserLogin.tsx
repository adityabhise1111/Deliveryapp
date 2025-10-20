import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext';

interface UserLoginData {
    email: string;
    password: string;
}


const UserLogin: React.FC = () => {
    const navigate = useNavigate()
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('UserSignUp must be used within UserContextProvider');
    }

    const { user, setUser } = context;

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submitHandler = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        const loginData: UserLoginData = {
            email,
            password
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, loginData);
            
            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token', data.token);

                navigate('/home');
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setEmail("");
            setPassword("");
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
                        className='bg-black text-white w-full py-3 rounded mt-2 text-xl'
                    >Login</button>
                    <p className='text-center'>New here &#63;<Link className='text-blue-800 ' to="/signup"> Create new account</Link></p>
                </form>
            </div>
            <div>
                <Link to={"/captain-login"}
                    className='bg-yellow-500 flex justify-center text-black w-full py-3 rounded mt-2 text-xl'
                >SignIn as Captain</Link>
            </div>
        </div>
    )
}

export default UserLogin