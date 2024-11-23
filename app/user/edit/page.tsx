"use client";

import Appbar from "@/app/components/Appbar";
import EditProfileForm from "@/app/components/EditProfileForm";
import Sidebar from "@/app/components/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
   
    if (status === "unauthenticated") {
      router.push("/auth/login"); 
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="bg-white min-h-screen">
        <div className="h-16">
          <Appbar />
        </div>
        <div className="flex">
          <div className="hidden md:block fixed w-52 lg:w-80 h-full">
            <Sidebar />
          </div>
          <div className="w-full ml-0 md:ml-52 lg:p-8 p-8  lg:ml-80  lg:mr-52 border-r border-l border-gray-200">
            <div className="text-2xl font-bold text-black">Edit Profile</div>
            <div className="mt-6 text-black text-sm">Name</div>
            <div className="h-8 w-full bg-gray-200 animate-pulse rounded-lg mb-2"></div>
            <div className="text-black mt-4">Bio</div>
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded-lg mb-2"></div>
            <div className="text-black mt-4">City</div>
            <div className="h-8 w-full bg-gray-200 animate-pulse rounded-lg mb-2"></div>
            <div className="text-black mt-4">Website</div>
            <div className="h-8 w-full bg-gray-200 animate-pulse rounded-lg mb-2"></div>
            <div className="text-black mt-4">Profile Image</div>
            <div className="h-16 w-full bg-gray-200 animate-pulse rounded-lg "></div>
            <div className="h-12 mt-6 rounded-lg animate-pulse bg-gray-200"></div>

          </div>
        </div>
      </div>
    ); 
  }

  if (!session?.user) {
    return <div>Error: Unable to fetch user session.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16">
        <Appbar />
      </div>
      <div className="flex">
        <div className="hidden md:block fixed w-52 lg:w-80 h-full">
          <Sidebar />
        </div>
        <div className="w-full ml-0 md:ml-52 lg:ml-80 min-h-screen lg:mr-52 border-r border-l border-gray-200">
          <EditProfileForm />
        </div>
      </div>
    </div>
  );
}
