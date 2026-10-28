import React, { createContext, useContext, useState } from 'react';
import { UserInfo } from '../services/authService';

interface UserContextType {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
}

const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
