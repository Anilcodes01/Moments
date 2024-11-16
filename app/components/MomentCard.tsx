"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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

  return (
    <div className="w-full border-b mt-2  border-gray-500   cursor-pointer  bg-gray-950  ">
      {/* User Info */}
      {user && (
        <div className="flex  justify-between    py-2 px-2">
          <div className="flex items-center">
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
          <div>
            <Ellipsis
              onClick={() => {
                router.push("#");
              }}
            />
          </div>
        </div>
      )}

      {/* Moment Image */}
      <div
        onClick={() => {
          router.push(`/moments/${moment.id}`);
        }}
        className="relative   w-full h-48  overflow-hidden"
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

      {/* Caption */}
      <div className="mt-4 ml-4 mb-4 text-gray-200 text-sm">
        <span className="font-bold mr-2">{moment.user?.name}</span>
        <span className="break-words">{moment.description}</span>
      </div>
    </div>
  );
}
