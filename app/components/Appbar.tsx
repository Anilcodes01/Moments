'use client'
import { useSession, signIn } from "next-auth/react";
import UserAvatar from "./Avatar";
import Link from 'next/link';

export default function Appbar() {
    const { data: session } = useSession();

    const loggedInUserAvatar = session?.user?.avatarUrl || "";
    const loggedInUserName = session?.user?.name || "";
    const loggedInUserID = session?.user?.id || "";

    return (
        <div className="h-16 flex fixed w-full items-center justify-between pr-4 pl-4 bg-white z-50 shadow-md">
            <div className="text-black text-3xl font-bold">
                Moments
            </div>
            <div>
                {session ? (
                    <UserAvatar 
                        src={loggedInUserAvatar} 
                        name={loggedInUserName} 
                        profileLink={`/${loggedInUserID}`} 
                        size={36} 
                        alt="Profile Picture" 
                    />
                ) : (
                    <Link href="/auth/signin" onClick={() => signIn()} className="text-gray-800">
                        Signin
                    </Link>
                )}
            </div>
        </div>
    );
}
