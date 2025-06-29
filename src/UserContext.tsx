import React, { createContext, useState, ReactNode, useContext } from 'react';

interface User {
  id: string;
  name: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

// KRITIKUS: UserContext exportálása
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: 'szilvi',
    name: 'Szilvi',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};