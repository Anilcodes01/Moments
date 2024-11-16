"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import MainMomentSkeleton from "@/app/components/MainMomentSkeleton";
import Appbar from "@/app/components/Appbar";
import Sidebar from "@/app/components/sidebar";

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

        const sortedMedia = fetchedMoment.media.sort(
          (a: Media, b: Media) =>
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

  if (loading)
    return (
      <p>
        <MainMomentSkeleton />
      </p>
    );
  if (!moment) return <p>Moment not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 mb-12 to-pink-50">
      <div className="h-12">
        <Appbar />
      </div>

      <div className="lg:flex md:flex flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar for larger screens */}
        <div className="hidden md:block w-52 lg:w-80 bg-white shadow-md h-full">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white lg:rounded-lg lg:shadow-md lg:m-10 p-6 lg:p-10 space-y-6 text-gray-800">
          <h1 className="text-3xl font-bold text-gray-900">{moment.title}</h1>
          <p className="text-lg text-gray-700">{moment.caption}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4">
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/${moment.user.id}`)}
              >
                {moment.user.avatarUrl ? (
                  <Image
                    src={moment.user.avatarUrl}
                    alt="user avatar"
                    width={96}
                    height={96}
                    className="w-12 h-12 rounded-full object-cover overflow-hidden border"
                  />
                ) : (
                  <FaUserCircle className="h-12 w-12 text-gray-300" />
                )}
              </div>
              <div>
                <p
                  onClick={() => router.push(`/${moment.user.id}`)}
                  className="font-semibold text-lg cursor-pointer"
                >
                  {moment.user.name}
                </p>
                <p
                  onClick={() => router.push(`/${moment.user.id}`)}
                  className="text-sm text-gray-500 cursor-pointer"
                >
                  @{moment.user.username}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moment.media.map((media) => {
              const formattedMediaDate = new Date(
                media.createdAt
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div key={media.id} className="relative bg-white shadow-md rounded-lg overflow-hidden">
                  {media.type === "PHOTO" ? (
                    <Image
                      src={media.url}
                      height={200}
                      alt={media.caption}
                      width={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {media.caption && (
                    <div className="p-4">
                      <p className="text-sm text-gray-800">{media.caption}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formattedMediaDate}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden h-12 fixed bottom-0 w-full bg-white border-t border-slate-200">
          <Sidebar isMobile={true} />
        </div>
      </div>
    </div>
  );
};

export default MomentPage;
