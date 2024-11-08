import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface UserAvatarProps {
  src: string; 
  alt?: string;
  size?: number; 
  className?: string; 
  profileLink?: string; 
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User Avatar',
  size = 40, 
  className = '',
  profileLink = '', 
}) => {
  const avatarImage = (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
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
