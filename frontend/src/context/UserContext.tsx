import React, { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface User {
  user: User | null;
  fullName?: {
    firstName: string;
    lastName: string;
  };
  email?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserDataContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    email:" ",
    fullName:{
      firstName: " ",
      lastName: " "
    },

  });

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContextProvider