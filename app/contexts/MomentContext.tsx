"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

interface Moment {
  id: string;
  title?: string;
  caption?: string;
  description?: string;
  createdAt?: string;
  coverImage?: string;
  media?: { url: string }[];
  user?: User;
  isLiked: boolean;
  likeCount: number;
  isBookmarked: boolean;
}

interface MomentContextType {
  moments: Moment[];
  loading: boolean;
  error: string | null;
  fetchMoments: () => Promise<void>;
  updateMomentLike: (momentId: string, isLiked: boolean) => void;
  updateMomentBookmark: (momentId: string, isBookmarked: boolean) => void;
}

const MomentContext = createContext<MomentContextType>({
  moments: [],
  loading: false,
  error: null,
  fetchMoments: async () => {},
  updateMomentLike: () => {},
  updateMomentBookmark: () => {}
});

export const MomentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMoments = useCallback(async () => {
    // If moments are already loaded, don't fetch again
    if (moments.length > 0) return;

    setLoading(true);
    try {
      const response = await axios.get("/api/moments/fetchAllMoments", {
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      setMoments(response.data.moments);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch moments.");
      setMoments([]);
    } finally {
      setLoading(false);
    }
  }, [moments.length]);

  const updateMomentLike = useCallback((momentId: string, isLiked: boolean) => {
    setMoments(prevMoments => 
      prevMoments.map(moment => 
        moment.id === momentId 
          ? { 
              ...moment, 
              isLiked, 
              likeCount: isLiked ? moment.likeCount + 1 : moment.likeCount - 1 
            } 
          : moment
      )
    );
  }, []);

  const updateMomentBookmark = useCallback((momentId: string, isBookmarked: boolean) => {
    setMoments(prevMoments => 
      prevMoments.map(moment => 
        moment.id === momentId 
          ? { ...moment, isBookmarked } 
          : moment
      )
    );
  }, []);

  return (
    <MomentContext.Provider value={{ 
      moments, 
      loading, 
      error, 
      fetchMoments, 
      updateMomentLike,
      updateMomentBookmark
    }}>
      {children}
    </MomentContext.Provider>
  );
};

// Custom hook to use moment context
export const useMoments = () => {
  const context = useContext(MomentContext);
  if (!context) {
    throw new Error('useMoments must be used within a MomentProvider');
  }
  return context;
};