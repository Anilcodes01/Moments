'use client'
import { useState, useEffect } from "react";
import Appbar from "./components/Appbar";
import axios from "axios";
import MomentCard from "./components/MomentCard";

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
  createdAt?: string;
  coverImage?: string;
  media?: { url: string }[];
  user?: User;
}

export default function Home() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/moments/fetchAllMoments");
        setMoments(response.data.moments);
      } catch (error) {
        setError("Failed to fetch moments.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoments();
  }, []);

  return (
    <div className="bg-slate-100 min-h-screen">
      <Appbar />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-black">Loading moments...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          moments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))
        )}
      </div>
    </div>
  );
}
