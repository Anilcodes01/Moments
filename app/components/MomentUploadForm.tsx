'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateMoment = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCoverImage(event.target.files[0]);
    }
  };

  const handleAddMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setMediaFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('caption', caption);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    mediaFiles.forEach((file) => formData.append('media', file));

    try {
      await axios.post('/api/moments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/moments');
    } catch (error) {
      console.error('Failed to create moment:', error);
      alert('Failed to create moment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block text-black w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="caption" className="block text-sm font-medium">
          Caption
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-1 block w-full text-black p-2 border rounded-md"
          rows={3}
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium">
          Cover Image
        </label>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="mt-1 block w-full text-white p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Media Files
        </label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleAddMedia}
            className="hidden"
            id="mediaInput"
          />
          <button
            type="button"
            onClick={() => document.getElementById('mediaInput')?.click()}
            className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400"
          >
            + Add Media
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {mediaFiles.map((file, index) => (
            <div key={index} className="text-sm text-gray-600">
              {file.name}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
      >
        {isSubmitting ? 'Uploading...' : 'Create Moment'}
      </button>
    </form>
  );
};

export default CreateMoment;
