import axios, { type AxiosResponse } from 'axios'
import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import type { CaptainContextType } from '../context/CaptainContext' // Add 'type' keyword

const CaptainLogout: React.FC = () => {
    console.log('[CaptainLogout] component rendered');

    const navigate = useNavigate();
    const context = useContext < CaptainContextType | undefined>(CaptainDataContext);
    const setCaptain = context?.setCaptain;
    const baseUrl = (import.meta.env.VITE_BASE_URL ?? '') as string;
    const token: string | null = localStorage.getItem('token');

    useEffect(() => {
        const logoutCaptain = async (): Promise<void> => {
            console.log('[CaptainLogout] logoutCaptain start', { baseUrl, token });

            // If no token available, clear and navigate
            if (!token) {
                console.log('[CaptainLogout] no token found, clearing Captain and navigating to /login');
                setCaptain?.(null);
                navigate('/login');
                return;
            }

            try {
                // GET /Captains/logout - backend expects GET (based on your logs)
                const response: AxiosResponse = await axios.get(`${baseUrl}/captains/logout`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('[CaptainLogout] received response', { status: response.status, data: response.data });

                if (response.status === 200) {
                    console.log('[CaptainLogout] logout successful, clearing token and Captain');
                    localStorage.removeItem('token');
                    setCaptain?.(null);
                    navigate('/login');
                    return;
                }

                console.warn('[CaptainLogout] unexpected response status, clearing and navigating', response.status);
                localStorage.removeItem('token');
                setCaptain?.(null);
                navigate('/login');
            } catch (err) {
                console.error('[CaptainLogout] logout request error:', err);
                // Ensure Captain is cleared even on error
                try {
                    localStorage.removeItem('token');
                } catch (e) {
                    console.warn('[CaptainLogout] error clearing token from localStorage', e);
                }
                setCaptain?.(null);
                navigate('/login');
            }
        };

        logoutCaptain();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl, token, navigate, setCaptain]);

    return (
        <div className="p-4">Logging out...</div>
    )
}

export default CaptainLogout