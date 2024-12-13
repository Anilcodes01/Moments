'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Moment {
  id: string;
  coverImage?: string; 
  media?: { url: string }[]; 
}

export default function MomentProfileCard({ moment }: { moment: Moment }) {
  const router = useRouter();
  const imageUrl = moment.coverImage || (moment.media && moment.media[0]?.url);

  return (
    <div onClick={() => {
      router.push(`/moments/${moment.id}`)
    }} className="w-full cursor-pointer max-w-xs mx-auto">
      <div className="relative  w-full h-0 pb-[150%]"> 
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="moment coverImage"
            layout="fill" 
            objectFit="cover" 
            quality={100} 
            className="rounded shadow-md" 
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded shadow-md flex justify-center items-center">
            <span className="text-white">No Image Available</span>
          </div>
        )}
      </div>
    </div>
  );
}
