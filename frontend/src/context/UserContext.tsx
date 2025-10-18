import React, { createContext, useState } from 'react'
import type { ReactNode } from 'react'

interface User {
  fullName?: {
    firstName: string;
    lastName: string;
  };
  email?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserDataContext = createContext<UserContextType | undefined>(undefined);

export const UserContext: React.FC<UserContextProviderProps> = ({ children }) => {
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

export default UserContext