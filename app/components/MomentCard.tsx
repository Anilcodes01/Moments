"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Moment {
  id: string;
  coverImage?: string;
  media?: { url: string }[];
  caption?: string;
  user?: User;
}

export default function MomentCard({ moment }: { moment: Moment }) {
  const router = useRouter();
  const imageUrl = moment.coverImage || "";
  const user = moment.user;

  return (
    <div
      onClick={() => {
        router.push(`/moments/${moment.id}`);
      }}
      className="w-full    cursor-pointer p-4 bg-black   "
    >
      {/* User Info */}
      {user && (
        <div className="flex relative  items-center mb-2">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-200" size={32} />
          )}
          <span className="ml-2 text-sm  font-bold text-gray-200">
            {user.name}
          </span>
        </div>
      )}

      {/* Moment Image */}
      <div className="relative   w-full h-40 rounded overflow-hidden">
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

      {/* Caption */}
      <div className="mt-2 text-center text-sm text-gray-600">
        {moment.caption}
      </div>
    </div>
  );
}
