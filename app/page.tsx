"use client";
import { useState, useEffect } from "react";
import Appbar from "./components/Appbar";
import axios from "axios";
import MomentCard from "./components/MomentCard";
import Sidebar from "./components/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MomentSkeleton from "./components/MomentSkeleton";

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
  description?: string; // Ensure you add this to access the description
  createdAt?: string;
  coverImage?: string;
  media?: { url: string }[];
  user?: User;
}

export default function Home() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
   

    const fetchMoments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/moments/fetchAllMoments", {
          headers: {
            "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        setMoments(response.data.moments);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch moments.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoments();
  }, [router, session]);

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      {/* Appbar */}
      <div className="h-12">
        <Appbar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block w-52  lg:w-80  shadow-md h-full">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto   pl-4 pr-4 mb-16 lg:px-10">
          {loading ? (
            <div className="text-center text-gray-700 text-lg">
              <MomentSkeleton />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg">{error}</div>
          ) : (
            <div className="  ">
              {moments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden h-12 fixed bottom-0 w-full bg-white border-t border-gray-800">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
