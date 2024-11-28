
'use client'
// contexts/UserContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  moments?: Moment[];
}

interface Moment {
  id: string;
  title: string;
  caption: string;
  createdAt: string;
  coverImage: string;
  visibility: "PUBLIC" | "PRIVATE" 
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  fetchUser: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  fetchUser: async () => {}
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async (userId: string) => {
    // If user is already loaded and the ID matches, don't fetch again
    if (user && user.id === userId) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/user/${userId}`);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [user]); // Add user as a dependency to prevent unnecessary calls

  return (
    <UserContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};