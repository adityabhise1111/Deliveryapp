import React, { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from './UserContext';

export interface Captain extends User {
    vehicle?: {
        color: string;
        plate: string;
        capacity: string;
        vehicleType: string;
    };
}
export interface CaptainContextType {
  captain: Captain | null;
  setCaptain: React.Dispatch<React.SetStateAction<User | null>>;
  
}
interface CaptainContextProviderProps {
  children: ReactNode;
}

export const CaptainDataContext = createContext<CaptainContextType | undefined>(undefined);

export const CaptainContext: React.FC<CaptainContextProviderProps> = ({ children }) => {
  const [captain, setCaptain] = useState<Captain | null>({
    email:" ",
    fullName:{
      firstName: " ",
      lastName: " "
    },

  });

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  )
}

export default CaptainContext ;