"use client";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MomentProfileCard from "../components/MomentProfileCard";
import { Settings } from "lucide-react";
import { UserPen } from "lucide-react";
import Sidebar from "../components/sidebar";
import { BookHeart } from "lucide-react";
import { useUser } from "../contexts/UserContext";





export default function Profile() {

  const { userId } = useParams();

  const router = useRouter();
  const { user, loading, fetchUser } = useUser();

  const [momentFilter, setMomentFilter] = useState<"PUBLIC" | "COLLABORATIVE" | "PRIVATE">("PUBLIC");

  useEffect(() => {
    if (!userId) return;

    fetchUser(userId as string);
  }, [userId, fetchUser]);


  const filteredMoments = user?.moments?.filter(moment => {
    switch (momentFilter) {
      case "PUBLIC":
        return moment.visibility === "PUBLIC";
      case "COLLABORATIVE":
        return moment.visibility === "PUBLIC";
      case "PRIVATE":
        return moment.visibility === "PRIVATE";
      default:
        return true;
    }
  }) || [];

  return (
    <div className="bg-gradient-to-br mb- min-h-screen from-blue-50 via-purple-50 to-pink-50 bg-yellow-300 text-gray-100 w-full flex flex-col   ">
      <div className="hidden md:block  bg-gradient-to-br from-blue-50 via-purple-50  to-pink-50 fixed w-52 lg:w-64 h-full shadow-md">
        <Sidebar />
      </div>

      <div className="text-gray-800 h-12 md:ml-52 lg:ml-64 flex justify-around items-center border-slate-200 border-b">
        <div className="">
          <Settings />
        </div>
        <div className="text-gray-800 font-bold ">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
          ) : (
            user?.username
          )}
        </div>
        <div
          onClick={() => {
            router.push("/user/edit");
          }}
        >
          <UserPen />
        </div>
      </div>

      <div className="md:ml-52 lg:ml-64 min-h-screen  ">
        {/* User Avatar and Name */}
        <div className="flex flex-col px-2   w-full ">
          <div className="  flex lg:w-full  lg:justify-around items-center gap-2  ">
            {user?.avatarUrl ? (
              <div className="rounded-full h-20 w-20 mt-4 overflow-hidden flex-shrink-0">
                <Image
                  src={user.avatarUrl}
                  alt="user avatar"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <FaUserCircle className="h-20 w-20 mt-4 text-gray-200" />
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
            <p className="text-gray-800 text-xs lg:ml-36 pl-2">{user?.bio}</p>
          </div>
        </div>

        {/* Moment Filters */}
        <div className="flex mt-8 gap-4 lg:w-full justify-around border-b border-slate-200 pb-2">
        <button 
          onClick={() => setMomentFilter("PUBLIC")}
          className={`text-gray-800 hover:text-gray-800 transition ${
            momentFilter === "PUBLIC" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : ""
          }`}
        >
          Public
        </button>
        <button 
          onClick={() => setMomentFilter("COLLABORATIVE")}
          className={`text-gray-800 hover:text-gray-800 transition ${
            momentFilter === "COLLABORATIVE" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : ""
          }`}
        >
          Collaborative
        </button>
        <button 
          onClick={() => setMomentFilter("PRIVATE")}
          className={`text-gray-800 hover:text-gray-800 transition ${
            momentFilter === "PRIVATE" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : ""
          }`}
        >
          Private
        </button>
      </div>

        {/* Moment Cards */}
        <div className="lg:mt-4 mt-2 lg:ml-36 w-full max-w-4xl mb-4 pl-2 lg:px-4 pr-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 h-64 rounded-md"
            ></div>
          ))
        ) : filteredMoments.length ? (
          filteredMoments.map((moment) => (
            <MomentProfileCard key={moment.id} moment={moment} />
          ))
        ) : (
          <div className="flex flex-col justify-center items-center w-full col-span-2 md:col-span-3 h-64 rounded-md">
            <BookHeart size={48} className="text-gray-400 mb-2" />
            <p className="text-gray-400 font-semibold">
              No moments in this category
            </p>
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
