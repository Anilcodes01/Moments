"use client";
import axios from "axios";

import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MomentCard from "../components/MomentCard";

interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  moments?: Moment[];
}

interface Moment {
  id: string;
  title: string;
  caption: string;
  createdAt: string;
  coverImage: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useParams();

  useEffect(() => {
    console.log("useEffect triggered", userId);
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        console.log("Making request to /api/user", userId);
        const response = await axios.get(`/api/user/${userId}`);
        console.log("User response:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className="bg-white w-full flex flex-col items-center p-5 min-h-screen">
      {/* User avatar */}
      <div className=" flex items-center justify-center">
        <div className="border p-1 rounded-full">
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="user avatar" />
          ) : (
            <FaUserCircle className="h-28 w-28  text-gray-300" />
          )}
        </div>
      </div>

      <div className="text-black text-xl mt-1">
        {user ? user.name : "Loading..."}
      </div>

      {/* user details */}
      <div className="border p-4 mt-4 w-full flex justify-around rounded-lg ">
        <div className="text-black  flex  flex-col">
          <span className="text-center">69</span>
          <span>Moments</span>
        </div>
        <div className="text-black flex flex-col">
          <span className="text-center">201</span>
          <span>Following</span>
        </div>
        <div className="text-black flex flex-col">
          <span className="text-center">14.7k</span>
          <span>Followers</span>
        </div>
      </div>

      <div className="gap-4 mt-6 w-full flex flex-col">
        <div className="text-black border-b  flex justify-around">
          {/* Toggle Buttons */}
          <button>Shared Moments </button>
          <button>Collaborative</button>
          <button>Private</button>
        </div>
        <div className="flex gap-4">
          {user?.moments?.length ? (
            user.moments.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))
          ) : (
            <p className="text-gray-600">No moments to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
