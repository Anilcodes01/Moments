"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MomentSection {
  image: File | null;
  caption: string;
  previewUrl: string | null;
}

const CreateMoment = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [momentSections, setMomentSections] = useState<MomentSection[]>([
    { image: null, caption: "", previewUrl: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCoverImage(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newMomentSections = [...momentSections];
      newMomentSections[index].image = file;
      newMomentSections[index].previewUrl = URL.createObjectURL(file);
      setMomentSections(newMomentSections);
    }
  };

  const handleCaptionChange = (index: number, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMomentSections = [...momentSections];
    newMomentSections[index].caption = event.target.value;
    setMomentSections(newMomentSections);
  };

  const handleAddMomentSection = () => {
    setMomentSections([
      ...momentSections,
      { image: null, caption: "", previewUrl: null },
    ]);
  };

  const handleRemoveMomentSection = (index: number) => {
    const newMomentSections = [...momentSections];
    newMomentSections.splice(index, 1);
    setMomentSections(newMomentSections);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append('description', description)
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    momentSections.forEach((section, index) => {
      if (section.image) formData.append(`media_${index}`, section.image);
      formData.append(`caption_${index}`, section.caption);
    });

    try {
      const response = await axios.post('/api/moments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.moment?.id) {
        router.push(`/moments/${response.data.moment.id}`);
      } else {
        throw new Error('Moment ID not found');
      }
    } catch (error) {
      console.error("Failed to create moment:", error);
      alert("Failed to create moment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 min-h-screen bg-white text-black p-6">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          className="mt-1 block w-full p-2 border outline-none rounded-md text-black"
          required
        />
      </div>

      <div className="mb-6">
  <label htmlFor="description" className="block text-sm font-medium">
    Description
  </label>
  <textarea
    id="description"
    value={description}
    onChange={handleDescriptionChange}
    className="mt-1 block w-full p-2 border outline-none rounded-md text-black"
    rows={3}
    placeholder="Write a short description of your moment..."
    required
  />
</div>


      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="block w-full p-2 border rounded-md text-black"
        />
        {coverPreviewUrl && (
          <Image
            src={coverPreviewUrl}
            alt="Cover Image Preview"
            width={800}
            height={200}
            className="mt-2 w-full h-[200px] object-cover rounded-lg"
          />
        )}
      </div>

      {momentSections.map((section, index) => (
        <div key={index} className="flex flex-col gap-6 mb-6">
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium mb-2">Image</label>
              <button
                type="button"
                onClick={() => handleRemoveMomentSection(index)}
                className="self-start px-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                ×
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e)}
              className="block w-full p-2 border rounded-md text-black"
            />
            {section.previewUrl && (
              <Image
                src={section.previewUrl}
                alt="Image Preview"
                width={800}
                height={200}
                className="mt-2 w-full h-[200px] object-cover rounded-lg"
              />
            )}
          </div>
          <textarea
            value={section.caption}
            onChange={(e) => handleCaptionChange(index, e)}
            className="block w-full p-2 outline-none rounded-md text-black"
            rows={3}
            placeholder="Write something about the image..."
            required
          ></textarea>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddMomentSection}
        className="px-2 bg-blue-400 text-white items-center text-center font-semibold rounded-full hover:bg-gray-400 mb-6"
      >
        +
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
      >
        {isSubmitting ? "Uploading..." : "Create Moment"}
      </button>
    </form>
  );
};

export default CreateMoment;
