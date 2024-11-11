'use client'
import { useSession } from "next-auth/react";
import UserAvatar from "./Avatar";


export default function Appbar() {
    const { data: session } = useSession();

    const loggedInUserAvatar = session?.user.avatarUrl || "";
    const loggedInUserID = session?.user.id || "";

    return (
        <div className="h-16 flex fixed w-full items-center justify-between pr-4 pl-4 bg-white z-50 shadow-md">
            <div className="text-black text-3xl font-bold">
                Moments
            </div>
            <div>
                <UserAvatar src={loggedInUserAvatar} profileLink={`/${loggedInUserID}`} size={36} alt="Profile Picture" />
            </div>
        </div>
    );
}
