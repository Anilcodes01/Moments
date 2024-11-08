"use client";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MomentProfileCard from "../components/MomentProfileCard";

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
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className="bg-gray-100 w-full flex flex-col items-center p-6 min-h-screen">
      {/* User Avatar and Name */}
      <div className="flex flex-col items-center">
        <div className="border border-gray-300 p-1 rounded-full shadow-md mb-4">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="user avatar"
              width={112}
              height={112}
              className="rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="h-28 w-28 text-gray-400" />
          )}
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {user ? user.name : "Loading..."}
        </h1>
        <span className="text-gray-500">{user?.username}</span>
      </div>

      {/* User Stats */}
      <div className="flex justify-between items-center border rounded-lg shadow-md bg-white mt-6 p-4 w-full max-w-lg">
        <div className="text-center text-gray-700">
          <span className=" font-semibold block">69</span>
          <span className="text-sm text-gray-500">Moments</span>
        </div>
        <div className="text-center text-gray-700">
          <span className=" font-semibold block">201</span>
          <span className="text-sm text-gray-500">Following</span>
        </div>
        <div className="text-center text-gray-700">
          <span className=" font-semibold block">14.7k</span>
          <span className="text-sm text-gray-500">Followers</span>
        </div>
      </div>

      {/* Moment Filters */}
      <div className="flex mt-8 gap-4 w-full max-w-lg border-b border-gray-300 pb-2 justify-around">
        <button className="py-2 text-gray-600 hover:text-gray-800 focus:text-blue-600 border-b-2 focus:border-blue-600 transition">
          Shared 
        </button>
        <button className="py-2 text-gray-600 hover:text-gray-800 focus:text-blue-600 border-b-2 focus:border-blue-600 transition">
          Collaborative
        </button>
        <button className="py-2 text-gray-600 hover:text-gray-800 focus:text-blue-600 border-b-2 focus:border-blue-600 transition">
          Private
        </button>
      </div>

      {/* Moment Cards */}
      <div className="mt-6 w-full max-w-4xl grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {user?.moments?.length ? (
    user.moments.map((moment) => (
      <MomentProfileCard key={moment.id} moment={moment} />
    ))
  ) : (
    <p className="text-gray-500 text-center w-full col-span-2 md:col-span-3">
      No moments to display.
    </p>
  )}
</div>

    </div>
  );
}
