"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Ellipsis } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Moment {
  id: string;
  coverImage?: string;
  media?: { url: string }[];
  description?: string;
  user?: User;
}

export default function MomentCard({ moment }: { moment: Moment }) {
  const router = useRouter();
  const imageUrl = moment.coverImage || "";
  const user = moment.user;
  const [isExpanded, setIsExpanded] = useState(false);


  const toggleDescription = () => setIsExpanded((prev) => !prev);

  return (
    <div className="w-full border-b mb-6 rounded-lg shadow-md p-2 border-slate-200 cursor-pointer bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* User Info */}
      {user && (
        <div className="flex justify-between py-2">
          <div className="flex items-center">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                width={96}
                height={96}
                className="rounded-full h-8 w-8 object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-800" size={32} />
            )}
            <span className="ml-2 text-sm font-bold text-gray-800">
              {user.name}
            </span>
          </div>
          <div>
            <Ellipsis
              className="text-gray-800"
              onClick={() => {
                router.push("#");
              }}
            />
          </div>
        </div>
      )}

     
      <div
        onClick={() => {
          router.push(`/moments/${moment.id}`);
        }}
        className="relative w-full h-48 overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Moment Cover Image"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        ) : (
          <div className="bg-gray-300 w-full h-full flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

   
      <div className="mt-4 ml-2 mb-4 text-gray-800 text-sm">
        <span className="font-bold mr-2">{moment.user?.name}</span>
        <span className="break-words text-sm">
          {moment.description ? (
            <>
              {isExpanded ? (
                moment.description
              ) : (
                `${moment.description.slice(0, 30)}...`
              )}
              {moment.description.length > 100 && (
                <button
                  onClick={toggleDescription}
                  className=" text-xs text-blue-500 "
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </>
          ) : (
            "No description provided."
          )}
        </span>
      </div>
    </div>
  );
}
