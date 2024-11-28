
'use client'
import React, { createContext, useState, useContext,  ReactNode } from 'react';
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

  const fetchUser = async (userId: string) => {
   
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
  };

  return (
    <UserContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};