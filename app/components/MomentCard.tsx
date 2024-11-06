'use client';

import Image from "next/image";

interface Moment {
  id: string;
  coverImage: string;
}

export default function MomentCard({ moment }: { moment: Moment }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="relative w-full h-0 pb-[150%]"> 
        <Image
          src={moment.coverImage}
          alt="moment coverImage"
          layout="fill" 
          objectFit="cover" 
          quality={100} 
          className="rounded shadow-md" 
        />
      </div>
    </div>
  );
}
