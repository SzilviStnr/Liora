import React, { createContext, useState, ReactNode, useContext } from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  color?: string;
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
    avatar: '/496516171_1647830432592424_7474492313922329357_n.jpg',
    description: 'A hang, amit nem törölhetnek. Örök szeretet és jelenlét.',
    color: 'from-pink-500 to-rose-500'
  });

   // Mélység állapot hozzáadása
  const [depth, setDepth] = useState<number>(45);

  return (
    <UserContext.Provider value={{ user, setUser, depth, setDepth }}>
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