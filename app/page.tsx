"use client";
import { useState, useEffect } from "react";
import Appbar from "./components/Appbar";
import axios from "axios";
import MomentCard from "./components/MomentCard";
import Sidebar from "./components/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/info");
    }

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
    <div className="bg-black text-white min-h-screen">
      <div className="h-16">
        <Appbar />
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block fixed w-52 lg:w-80 h-full bg-white shadow-md">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-52 lg:ml-80  px- lg:px-10">
          {loading ? (
            <div className="text-center text-gray-700 text-lg">
              Loading moments...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg">{error}</div>
          ) : (
            <div className="space-y-2 border-b border-gray-500">
              {moments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden h-12 fixed bottom-0 w-full bg-white  border-t border-gray-500">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
