"use client";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

type Media = {
  id: string;
  url: string;
  type: "PHOTO" | "VIDEO";
  caption: string;
};

type Moment = {
  id: string;
  title: string;
  caption: string;
  coverImage: string;
  media: Media[];
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
  };
};

const MomentPage = () => {
  const { id } = useParams();
  const [moment, setMoment] = useState<Moment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMoment = async () => {
      try {
        const response = await axios.get(`/api/moments/${id}`);
        setMoment(response.data);
      } catch (error) {
        console.error("Error fetching moment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoment();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!moment) return <p>Moment not found.</p>;

  return (
    <div className="space-y-4 bg-white min-h-screen text-black p-4">
      <h1 className="text-2xl border p-1 rounded-lg font-semibold">
        {moment.title}
      </h1>
      <p>{moment.caption}</p>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <div>
            {moment.user.avatarUrl ? (
              <Image
                src={moment.user.avatarUrl}
                alt="user avatar"
                width={20}
                height={20}
                className="w-10 h-10 rounded-full overflow-hidden"
              />
            ) : (
              <FaUserCircle className="h-10 w-10 text-gray-300" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{moment.user.name}</p>
            <p className="text-xs text-gray-500">{moment.user.username}</p>
          </div>
        </div>
      </div>
      <div className="mt-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {moment.media.map((media) => (
          <div key={media.id} className="relative">
            {media.type === "PHOTO" ? (
              <Image
                src={media.url}
                height={200}
                alt={media.caption}
                width={200}
                className="w-full h-48 border object-cover rounded-lg"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            {media.caption && <p className=" mt-2">{media.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MomentPage;
