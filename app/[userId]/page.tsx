"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  moments?: Moment[];
}

interface Moment {
  id: string;
  title: string;
  caption: string;
  createdAt: string;
  coverImage: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return; // Exit if userId is undefined

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        console.log("User response:", response.data);
        setUser(response.data.user); // Set the user state
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="text-black">{user ? user.name : "Loading..."}</div>
      <div className="text-black">{user?.id}</div>
      <div>
        {user?.moments?.length ? (
          user.moments.map((moment) => (
            <div
              key={moment.id}
              className="p-4 border border-gray-200 rounded shadow"
            >
              <h2 className="text-lg  text-black font-semibold">{moment.title}</h2>
              <p className="text-gray-600">{moment.caption}</p>
              <img
                src={moment.coverImage}
                alt={moment.title}
                className="w-full h-auto mt-2 rounded"
              />
              <p className="text-sm text-gray-400">
                Created at: {new Date(moment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No moments to display.</p>
        )}
      </div>
    </div>
  );
}
