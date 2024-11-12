'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
// import MomentUpdateForm from "@/app/components/MomentUpdateForm";

type Media = {
  id: string;
  url: string;
  type: "PHOTO" | "VIDEO";
  caption: string;
  createdAt: string; 
};

type Moment = {
  id: string;
  title: string;
  caption: string;
  coverImage: string;
  createdAt: string;
  media: Media[];
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
  };
};

const MomentPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [moment, setMoment] = useState<Moment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMoment = async () => {
      try {
        const response = await axios.get(`/api/moments/${id}`);
        const fetchedMoment = response.data;

        const sortedMedia = fetchedMoment.media.sort((a: Media, b: Media) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        sortedMedia.reverse();

        setMoment({
          ...fetchedMoment,
          media: sortedMedia, 
        });
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
    <div className="space-y-4 bg-black min-h-screen text-gray-200 p-4">
      <h1 className="text-2xl  p-1 rounded-lg font-semibold">{moment.title}</h1>
      <p>{moment.caption}</p>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <div onClick={() => router.push(`/${moment.user.id}`)}>
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
            <p onClick={() => router.push(`/${moment.user.id}`)} className="font-semibold text-sm">{moment.user.name}</p>
            <p onClick={() => router.push(`/${moment.user.id}`)} className="text-xs text-gray-500">@{moment.user.username}</p>
          </div>
          
        </div>
      </div>
      <div className="mt-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {moment.media.map((media) => {
          
          const formattedMediaDate = new Date(media.createdAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
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
              {media.caption && 
              <div>
                <p className="mt-2">{media.caption}</p>
                <p className="mt-1 text-xs text-gray-600">{formattedMediaDate}</p> {/* Display formatted media creation date */}
              </div>
              }
            </div>
          );
        })}
      </div>

      {/* <MomentUpdateForm moment={moment}/> */}
    </div>
  );
};

export default MomentPage;
