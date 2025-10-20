import axios, { type AxiosResponse } from 'axios'
import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import type { UserContextType } from '../context/UserContext' // Add 'type' keyword

const UserLogout: React.FC = () => {
    console.log('[UserLogout] component rendered');

    const navigate = useNavigate();
    const context = useContext < UserContextType | undefined>(UserDataContext);
    const setUser = context?.setUser;
    const baseUrl = (import.meta.env.VITE_BASE_URL ?? '') as string;
    const token: string | null = localStorage.getItem('token');

    useEffect(() => {
        const logoutUser = async (): Promise<void> => {
            console.log('[UserLogout] logoutUser start', { baseUrl, token });

            // If no token available, clear and navigate
            if (!token) {
                console.log('[UserLogout] no token found, clearing user and navigating to /login');
                setUser?.(null);
                navigate('/login');
                return;
            }

            try {
                // GET /users/logout - backend expects GET (based on your logs)
                const response: AxiosResponse = await axios.get(`${baseUrl}/users/logout`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('[UserLogout] received response', { status: response.status, data: response.data });

                if (response.status === 200) {
                    console.log('[UserLogout] logout successful, clearing token and user');
                    localStorage.removeItem('token');
                    setUser?.(null);
                    navigate('/login');
                    return;
                }

                console.warn('[UserLogout] unexpected response status, clearing and navigating', response.status);
                localStorage.removeItem('token');
                setUser?.(null);
                navigate('/login');
            } catch (err) {
                console.error('[UserLogout] logout request error:', err);
                // Ensure user is cleared even on error
                try {
                    localStorage.removeItem('token');
                } catch (e) {
                    console.warn('[UserLogout] error clearing token from localStorage', e);
                }
                setUser?.(null);
                navigate('/login');
            }
        };

        logoutUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl, token, navigate, setUser]);

    return (
        <div className="p-4">Logging out...</div>
    )
}

export default UserLogout