"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

export default function EditProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const userId = session?.user.id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/user/${userId}`, {
          headers: {
            "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        const user = userResponse.data.user;
        setName(user.name || "");
        setBio(user.bio || "");
        setAvatarPreview(user.avatarUrl || "/default-avatar.png");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatar(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);

      const response = await axios.post(`/api/user/${userId}/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        if (session) {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name,
              bio,
              avatarUrl: response.data.user.avatarUrl,
            },
          });
        }

        toast.success("Profile updated successfully!");

        setTimeout(() => {
          router.push(`/${userId}`);
        }, 100);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Error while updating profile, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 border m-4 min-h-screen rounded-lg"
    >
      <Toaster position="top-right" reverseOrder={false} />
      <div className="text-2xl text-black font-bold">Edit Profile</div>
      <div className="flex text-black pt-4 w-full flex-col gap-4">
        <div className="flex flex-col justify-center relative"></div>

        <div className="flex flex-col justify-center relative">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden mt-4">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                width={384}
                height={384}
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={session?.user.avatarUrl || "/default-avatar.png"}
                alt="User Avatar"
                width={384}
                height={384}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-2 right-2 border p-2 rounded cursor-pointer text-sm"
            onClick={() => document.getElementById("avatar")?.click()}
          >
            Change Avatar
          </button>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg text-sm outline-none px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border rounded-lg outline-none p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`p-2 bg-blue-500 rounded-lg mt-2 text-white ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
