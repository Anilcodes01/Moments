"use client";
import { GoHome } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import { BookOpenText } from 'lucide-react';

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
  console.log(userProfile)
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
      className={`bg-gray-950 ${
        isMobile ? "w-full flex-row items-center justify-around" : "w-full border-r  flex-col"
      } flex items-center h-full md:h-screen text-black`}
    >
      {/* Navigation buttons */}
      <div
        className={`${
          isMobile
            ? "flex justify-around items-center w-full p-2"
            : "flex flex-col w-full text-center p-4 gap-4"
        }`}
      >
       <Link href={"/"}>
  <div className="flex gap-2 hover:lg:bg-gray-400 hover:md:bg-gray-400  items-center justify-center text-white cursor-pointer rounded-lg p-2 hover:text-white">
    <GoHome size={24} className="flex-shrink-0" />
    {!isMobile && (
      <button
        onClick={() => router.push("/")}
        className="text-xl w-full   flex items-center"
      >
        Home
      </button>
    )}
  </div>
</Link>

        <div className="flex gap-2 hover:lg:bg-gray-400 hover:md:bg-gray-400 hover:text-white items-center text-white cursor-pointer  rounded-lg p-2 ">
          <Search size={24} />
          {!isMobile && <button className="text-xl">Search</button>}
        </div>
        <div className="flex gap-2 hover:lg:bg-gray-400 hover:md:bg-gray-400 items-center text-white cursor-pointer  rounded-lg p-2 ">
          <SquarePlus onClick={() => router.push("/upload")} size={24} />
          {!isMobile && (
            <button
              onClick={() => router.push("/network")}
              className="text-xl w-full flex items-center"
            >
              Post
            </button>
          )}
        </div>

        {!isMobile ? (
          <div className="flex gap-2 text-white items-center cursor-pointer hover:bg-slate-600 rounded-lg p-2 ">
            <BookOpenText onClick={() => router.push("/bookmarks")} size={24} />
            <button
              onClick={() => router.push("/bookmarks")}
              className="text-xl w-full flex items-start"
            >
              Stories
            </button>
          </div>
        ) : (
          <Link href={`/${userId}`}>
  <div className="flex gap-2  items-center cursor-pointer rounded-lg p-2">
    <div className="flex h-8 w-8  overflow-hidden items-center">
      {session?.user.avatarUrl ? (
        <Image
          src={session.user.avatarUrl}
          alt="User Profile Picture"
          width={100}
          height={100}
          className="rounded-full h-8 w-8 overflow-hidden object-cover cursor-pointer"
        />
      ) : (
        <div className="flex items-center justify-center cursor-pointer h-7 w-7 rounded-full border bg-gray-500 text-black">
          {session?.user.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  </div>
</Link>
        )}
      </div>

     
    </div>
  );
}
