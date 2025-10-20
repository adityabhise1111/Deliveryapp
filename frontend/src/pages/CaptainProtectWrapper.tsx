import React, { useContext, useEffect } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios, { type AxiosResponse } from 'axios'


const CaptainProtectWrapper = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const context = useContext(CaptainDataContext);

    console.log('[CaptainProtectWrapper] Token:', token ? 'EXISTS' : 'NOT FOUND');
    console.log('[CaptainProtectWrapper] Captain context:', context?.captain);

    useEffect(() => {
        // Only check token, not Captain context (context might not be loaded yet)
        if (!token) {
            console.log('[CaptainProtectWrapper] No token, redirecting to /Captain-login');
            navigate('/captain-login');
        }
        captainAuthCheck();
    }, [token, navigate]);

    const captainAuthCheck = async (): Promise<void> => {
        try {
            const response: AxiosResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status !== 200) {
                console.log('[CaptainProtectWrapper] Invalid token, redirecting to /captain-login');
                localStorage.removeItem('token');
                navigate('/captain-login');
            }
        } catch (error) {
            console.log('[CaptainProtectWrapper] Error validating token, redirecting to /captain-login', error);
            localStorage.removeItem('token');
            navigate('/captain-login');
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

export default CaptainProtectWrapper