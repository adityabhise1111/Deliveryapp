import React, { useContext, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios, {type AxiosResponse} from 'axios'
 

const UserProtectWrapper = ({children}: {children: React.ReactNode}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const context = useContext(UserDataContext);
    
    console.log('[UserProtectWrapper] Token:', token ? 'EXISTS' : 'NOT FOUND');
    console.log('[UserProtectWrapper] User context:', context?.user);

    useEffect(() => {
        // Only check token, not user context (context might not be loaded yet)
        if (!token) {
            console.log('[UserProtectWrapper] No token, redirecting to /login');
            navigate('/login');
        }
        userAuthCheck();
    }, [token, navigate]);
    const userAuthCheck = async (): Promise<void> => {
        try {
            const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status !== 200) {
                console.log('[UserProtectWrapper] Invalid token, redirecting to /User-login');
                localStorage.removeItem('token');
                navigate('/login');
            }
        } catch (error) {
            console.log('[UserProtectWrapper] Error validating token, redirecting to /User-login', error);
            localStorage.removeItem('token');
            navigate('/login');
        }
    }

    if (!token) {
        return null;
    }

    return (
        <>
        {children}
        </>
    )
}

export default UserProtectWrapper