// customHooks/userIdContext.js
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
type UserIdContextType = {
  userId: string | null;
  setUserIdGlobal: (newUserId: string | null) => void;
};

const initialContextValue: UserIdContextType = {
  userId: null,
  setUserIdGlobal: (newUserId) => {}, // Update the type of newUserId
};

const UserIdContext = createContext(initialContextValue);

interface UserIdProviderProps {
  children: ReactNode; // Define the children prop with ReactNode type
}

export function useUserId() {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
}

export function UserIdProvider({ children }: UserIdProviderProps) {
  const [userId, setUserId] = useState<string | null>(null);

  const setUserIdGlobal = (newUserId: string | null) => {
    setUserId(newUserId);
  };

  const contextValue: UserIdContextType = {
    userId,
    setUserIdGlobal,
  };

  return (
    <UserIdContext.Provider value={contextValue}>
      {children}
    </UserIdContext.Provider>
  );
}
