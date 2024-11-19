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
    <div className="bg-gradient-to-br min-h-screen from-blue-50 via-purple-50 to-pink-50 bg-yellow-300 text-gray-100 w-full flex flex-col   ">
    

<div className="hidden md:block  bg-gradient-to-br from-blue-50 via-purple-50  to-pink-50 fixed w-52 lg:w-80 h-full shadow-md">
          <Sidebar />
        </div>

      <div className="text-gray-800 h-12 md:ml-52 lg:ml-80 flex justify-around items-center border-slate-200 border-b">
        <div>
        <Settings />
        </div>
        <div className="text-gray-800 font-bold ">
        {loading ? (
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
          ) : (
            user?.username
          )}
        </div>
        <div>
        <UserPen />
        </div>
      </div>





     <div className="md:ml-52 lg:ml-80 min-h-screen  ">
       {/* User Avatar and Name */}
       <div className="flex flex-col px-2   w-full ">
        <div className="  flex lg:w-full lg:justify-around items-center gap-2  ">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="user avatar"
              width={112}
              height={112}
              className="rounded-full h-20 w-20 p-1 mt-4 object-cover"
            />
          ) : (
            <FaUserCircle className="h-24 w-24 mt-4  text-gray-200" />
          )}

          <div className="flex justify-between p-4 mt-4 w-full max-w-lg">
            <div className="text-center text-gray-800">
              <span className=" font-semibold block">69</span>
              <span className="text-sm text-gray-800">Moments</span>
            </div>
            <div className="text-center text-gray-800">
              <span className=" font-semibold block">201</span>
              <span className="text-sm text-gray-800">Following</span>
            </div>
            <div className="text-center text-gray-800">
              <span className=" font-semibold block">14.7k</span>
              <span className="text-sm text-gray-800">Followers</span>
            </div>
          </div>
        </div>
       <div className=" flex mt-1 flex-col">
       <h1 className=" pl-2 lg:ml-36 font-semibold flex flex-col text-gray-800">
       {loading ? (
              <div className="animate-pulse bg-gray-200 h-5 w-20 rounded"></div>
            ) : (
              user?.name
            )}
            
        </h1>
       
       </div>
      </div>

      {/* Moment Filters */}
      <div className="flex mt-8 gap-4 lg:w-full   justify-around border-b border-slate-200 pb-2 ">
        <button className=" text-gray-800 hover:text-gray-800 focus:text-blue-600  focus:border-blue-600 transition">
          Shared
        </button>
        <button className=" text-gray-800 hover:text-gray-800 focus:text-blue-600  focus:border-blue-600 transition">
          Collaborative
        </button>
        <button className=" text-gray-800 hover:text-gray-800 focus:text-blue-600  focus:border-blue-600 transition">
          Private
        </button>
      </div>

      {/* Moment Cards */}
      <div className="lg:mt-4 mt-2 w-full max-w-4xl mb-4 pl-2 lg:px-4 pr-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading
    ? Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 h-64 rounded-md"
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

     <div className="md:hidden h-12  fixed bottom-0 w-full   shadow-md border-t border-slate-200">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
