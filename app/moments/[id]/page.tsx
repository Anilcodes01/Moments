'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

type Media = {
  id: string;
  url: string;
  type: 'PHOTO' | 'VIDEO';
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
        console.error('Error fetching moment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoment();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!moment) return <p>Moment not found.</p>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-semibold">{moment.title}</h1>
      <p>{moment.caption}</p>
      <div className="flex items-center space-x-4">
      
        <div>
          <p className="font-semibold">{moment.user.name}</p>
          <p className="text-sm text-gray-500">@{moment.user.username}</p>
        </div>
      </div>
      <div className="mt-4">
       
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {moment.media.map((media) => (
          <div key={media.id} className="relative">
            {media.type === 'PHOTO' ? (
              <Image
                src={media.url}
                height={200}
                alt={media.caption}
                width={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            {media.caption && (
              <p className="text-center mt-2">{media.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MomentPage;
