"use client";
import {  useEffect } from "react";
import Appbar from "./components/Appbar";

import MomentCard from "./components/MomentCard";
import Sidebar from "./components/sidebar";
import { useSession } from "next-auth/react";
import MomentSkeleton from "./components/MomentSkeleton";
import { useMoments } from "./contexts/MomentContext";



export default function Home() {
 
  const { moments, loading, error, fetchMoments } = useMoments();
  

  const { data: session } = useSession();
  

  useEffect(() => {
   

    fetchMoments();

  }, [ session]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50  to-pink-50 text-white min-h-screen flex flex-col">
      {/* Appbar */}
      <div className="h-12">
        <Appbar />
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block w-52  fixed lg:w-64  shadow-md h-full">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto items-center mt-4  pl-4 pr-4 mb-16 lg:mr-52  lg:px-10">
          {loading ? (
            <div className="text-center md:ml-52 lg:ml-96 lg:w-2/3 text-gray-700 text-lg">
              <MomentSkeleton />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg">{error}</div>
          ) : (
            <div className=" flex flex-col md:ml-52 items-center ">
              {moments.map((moment) => (
                <MomentCard key={moment.id} moment={moment} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden h-12 fixed bottom-0 w-full bg-white border-t border-slate-200">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
}
