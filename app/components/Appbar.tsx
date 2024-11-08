'use client'
import { useSession } from "next-auth/react";
import UserAvatar from "./Avatar";


export default function Appbar() {
    const {data: session} = useSession();

    const loggedInUserAvatar = session?.user.avatarUrl  || ""
    const loggedInUserID = session?.user.id || ""

    return <div className="h-16 flex items-center justify-between pr-4 pl-4 bg-white">
        <div className="text-black text-3xl  font-">
           Moments
        </div>
        <div>
            <UserAvatar src={loggedInUserAvatar} profileLink={`/${loggedInUserID}`} size={36} alt="Profile Picture" />
        </div>
    </div>
}