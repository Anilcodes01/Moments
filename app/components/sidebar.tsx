"use client";
import { GoHome } from "react-icons/go";
import { GoBookmark } from "react-icons/go";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  bio?: string;
  website?: string;
  city?: string;
}

export default function Sidebar({ isMobile }: { isMobile?: boolean }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/user/${userId}`);
          const userData = response.data.user;
          setUserProfile(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  return (
    <div
      className={`bg-black ${
        isMobile ? "w-full flex-row  justify-around" : "w-full flex-col"
      } flex items-center h-full md:h-screen text-black`}
    >
      {/* Navigation buttons */}
      <div
        className={`${
          isMobile
            ? "flex justify-around w-full p-2"
            : "flex flex-col w-full text-center p-4 gap-4"
        }`}
      >
        <div className="flex gap-2 items-center text-white cursor-pointer hover:bg-slate-200 rounded-lg p-2 hover:text-white">
          <GoHome onClick={() => router.push("/")} size={24} />
          {!isMobile && (
            <button
              onClick={() => router.push("/")}
              className="text-xl w-full items-center flex"
            >
              Home
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center text-white cursor-pointer hover:bg-slate-200 rounded-lg p-2 hover:text-black">
          <Search size={22} />
          {!isMobile && <button className="text-xl">Search</button>}
        </div>
        <div className="flex gap-2 items-center text-white cursor-pointer hover:bg-slate-200 rounded-lg p-2 hover:text-black">
          <SquarePlus onClick={() => router.push("/upload")} size={24} />
          {!isMobile && (
            <button
              onClick={() => router.push("/network")}
              className="text-xl w-full flex items-start"
            >
              Network
            </button>
          )}
        </div>

        {!isMobile ? (
          <div className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 rounded-lg p-2 hover:text-black">
            <GoBookmark onClick={() => router.push("/bookmarks")} size={24} />
            <button
              onClick={() => router.push("/bookmarks")}
              className="text-xl w-full flex items-start"
            >
              Bookmarks
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 rounded-lg p-2 hover:text-black">
            <div
              onClick={() => {
                router.push(`/${userId}`);
              }}
              className="flex h-8 w-8 overflow-hidden items-center"
            >
              {session?.user.avatarUrl ? (
                <Image
                  src={session.user.avatarUrl}
                  alt="User Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full h-8 w-8 overflow-hidden object-cover cursor-pointer"
                />
              ) : (
                <div className="flex items-center justify-center cursor-pointer h-7 w-7 rounded-full border bg-gray-200 text-black">
                  {session?.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User profile */}
      {!isMobile && (
        <div className="text-black w-full mt-auto p-4 flex flex-col gap-2">
          <div
            onClick={() => router.push(`/${userId}`)}
            className="flex gap-2 items-center bg-slate-100 p-2 cursor-pointer hover:bg-slate-200 rounded-lg hover:text-black"
          >
            <div>
              {session?.user.avatarUrl ? (
                <Image
                  src={session.user.avatarUrl}
                  alt="User Profile Picture"
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer border"
                />
              ) : (
                <FaUserCircle size={32} className="text-gray-500" />
              )}
            </div>
            <button className="text-xl text-black">{userProfile?.name}</button>
          </div>
        </div>
      )}
    </div>
  );
}
