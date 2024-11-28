import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface UserAvatarProps {
  src?: string; 
  alt?: string;
  name?: string; 
  size?: number; 
  className?: string; 
  profileLink?: string; 
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User Avatar',
  name = '',
  size = 40, 
  className = '',
  profileLink = '', 
}) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '';

  const avatarImage = src ? (
    <Image
      src={src}
      alt={alt}
      width={80}
      height={80}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {firstLetter }
    </div>
  );

  return profileLink ? (
    <Link href={profileLink} aria-label="View Profile">
      {avatarImage}
    </Link>
  ) : (
    avatarImage
  );
};

export default UserAvatar;
