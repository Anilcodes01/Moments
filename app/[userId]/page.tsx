"use client";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MomentProfileCard from "../components/MomentProfileCard";
import { Settings } from 'lucide-react';
import { UserPen } from 'lucide-react';
import Sidebar from "../components/sidebar";
import { BookHeart } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className="bg-gray-950 text-gray-100 w-full flex flex-col mb-12  min-h-screen">

<div className="hidden md:block bg-black fixed w-52 lg:w-80 h-full shadow-md">
          <Sidebar />
        </div>

      <div className="text-gray-100 h-12 flex justify-around items-center border-gray-500 border-b">
        <div>
        <Settings />
        </div>
        <div className="text-gray-100 font-bold ">
        {loading ? (
            <div className="animate-pulse bg-gray-800 h-6 w-24 rounded"></div>
          ) : (
            user?.username
          )}
        </div>
        <div>
        <UserPen />
        </div>
      </div>





     <div className="">
       {/* User Avatar and Name */}
       <div className="flex flex-col px-2 ">
        <div className="  flex  items-center gap-2  ">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="user avatar"
              width={112}
              height={112}
              className="rounded-full h-20 w-20 p-1 mt-4 object-cover"
            />
          ) : (
            <FaUserCircle className="h-24 w-24 mt-4  text-gray-100" />
          )}

          <div className="flex justify-between p-4 mt-4 w-full max-w-lg">
            <div className="text-center text-gray-200">
              <span className=" font-semibold block">69</span>
              <span className="text-sm text-gray-200">Moments</span>
            </div>
            <div className="text-center text-gray-200">
              <span className=" font-semibold block">201</span>
              <span className="text-sm text-gray-200">Following</span>
            </div>
            <div className="text-center text-gray-100">
              <span className=" font-semibold block">14.7k</span>
              <span className="text-sm text-gray-100">Followers</span>
            </div>
          </div>
        </div>
       <div className=" flex mt-1 flex-col">
       <h1 className=" pl-4 font-semibold text-gray-300">
       {loading ? (
              <div className="animate-pulse bg-gray-800 h-5 w-24 rounded"></div>
            ) : (
              user?.name
            )}
        </h1>
        <span className="text-gray-300 pl-4 text-sm ">
        {loading ? (
              <div className="animate-pulse bg-gray-800 mt-1 h-4 w-32 rounded"></div>
            ) : (
              `@${user?.username}`
            )}
        </span>
       </div>
      </div>

      {/* Moment Filters */}
      <div className="flex mt-8 gap-4 w-full max-w-lg border-b border-gray-500 pb-2 justify-around">
        <button className=" text-gray-300 hover:text-gray-800 focus:text-blue-600  focus:border-blue-600 transition">
          Shared
        </button>
        <button className=" text-gray-300 hover:text-gray-800 focus:text-blue-600  focus:border-blue-600 transition">
          Collaborative
        </button>
        <button className=" text-gray-300 hover:text-gray-800 focus:text-blue-600  focus:border-blue-600 transition">
          Private
        </button>
      </div>

      {/* Moment Cards */}
      <div className="mt-2 w-full max-w-4xl mb-4 pl-2 pr-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading
    ? Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-800 h-64 rounded-md"
        ></div>
      ))
    : user?.moments?.length ? (
      user.moments.map((moment) => (
        <MomentProfileCard key={moment.id} moment={moment} />
      ))
    ) : (
      <div className="flex flex-col justify-center items-center w-full col-span-2 md:col-span-3 h-64  rounded-md">
        <BookHeart size={48} className="text-gray-400 mb-2" />
        <p className="text-gray-400 font-semibold">Begin your collection of memories!</p>
      </div>
    )}
</div>

     </div>

     <div className="md:hidden h-12  fixed bottom-0 w-full bg-black  shadow-md border-t border-gray-500">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
