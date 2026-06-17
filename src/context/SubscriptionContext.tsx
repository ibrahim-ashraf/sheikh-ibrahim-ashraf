import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkPremiumStatus } from '../services/purchaseService';
import { UserInfo } from '../services/authService';

interface SubscriptionContextType {
  isPremium: boolean;
  isLoading: boolean;
  userInfo: UserInfo | null;
  checkSubscription: () => Promise<void>;
  setUserInfo: (info: UserInfo | null) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  isLoading: true,
  userInfo: null,
  checkSubscription: async () => { },
  setUserInfo: () => { }
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const checkSubscription = async () => {
    try {
      const status = await checkPremiumStatus();
      setIsPremium(status);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isLoading,
        userInfo,
        checkSubscription,
        setUserInfo
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
