import { createContext, useEffect, } from 'react'
import type { ReactNode } from 'react'
import { io, Socket } from 'socket.io-client';

export const SocketContext = createContext<any>(null);

const socket: Socket = io(`${import.meta.env.VITE_BASE_URL}`); // replace with your server URL
interface SocketContextProviderProps {
    children: ReactNode;
}
export const SocketProvider = ({ children }: SocketContextProviderProps) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('error');
        }
    }, []);

    const sendMessage = (eventName: string, message: string) => {
        socket.emit(eventName, message);
    }

    const receiveMessage = (eventName: string, callback: (message: string) => void) => {
        socket.on(eventName, (message: string) => {
            callback(message);
        });

    }

    return (
        <SocketContext.Provider value={{ sendMessage, receiveMessage, socket }}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;