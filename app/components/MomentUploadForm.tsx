"use client";

import { useState } from "react";
import { compressImage } from "@/app/utils/fileHelpers";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaCloudUploadAlt, FaEdit, FaLock, FaGlobe } from "react-icons/fa";
import MentionTextarea from "./MentionTextArea";

interface MomentSection {
  image: File | null;
  caption: string;
  previewUrl: string | null;
  mentionedUsers: string[] | null;
}

const CreateMoment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [momentSections, setMomentSections] = useState<MomentSection[]>([
    { image: null, caption: "", previewUrl: null, mentionedUsers: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleCoverImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const file = event.target.files[0];

        if (file.size > 10 * 1024 * 1024) {
          alert("File is too large. Please select an image under 10MB.");
          return;
        }

        const compressedFile = await compressImage(file);
        setCoverImage(compressedFile);
        setCoverPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Error processing image. Please try again.");
      }
    }
  };

  const handleImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const file = event.target.files[0];

        if (file.size > 10 * 1024 * 1024) {
          alert("File is too large. Please select an image under 10MB.");
          return;
        }

        const compressedFile = await compressImage(file);
        const newMomentSections = [...momentSections];
        newMomentSections[index].image = compressedFile;
        newMomentSections[index].previewUrl =
          URL.createObjectURL(compressedFile);
        setMomentSections(newMomentSections);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Error processing image. Please try again.");
      }
    }
  };

  const handleAddMomentSection = () => {
    setMomentSections([
      ...momentSections,
      { image: null, caption: "", previewUrl: null, mentionedUsers: null },
    ]);
  };

  const handleRemoveMomentSection = (index: number) => {
    const newMomentSections = [...momentSections];
    newMomentSections.splice(index, 1);
    setMomentSections(newMomentSections);
  };

  const handleNextStep = () => {
    if (title && momentSections) {
      setCurrentStep(2);
    } else {
      alert("Please fill all fields for the moment.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("visibility", visibility);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    momentSections.forEach((section, index) => {
      if (section.image) formData.append(`media_${index}`, section.image);
      formData.append(`caption_${index}`, section.caption);
      formData.append(
        `mentionedUsers_${index}`,
        JSON.stringify(section.mentionedUsers)
      );
    });

    try {
      const response = await axios.post("/api/moments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.moment?.id) {
        router.push(`/moments/${response.data.moment.id}`);
      } else {
        throw new Error("Moment ID not found");
      }
    } catch (error) {
      console.error("Failed to create moment:", error);
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PrivacyToggle = () => (
    <div className="flex items-center  mb-6">
      <div
        className={`flex items-center px-4 py-2 text-sm rounded-full cursor-pointer transition-colors duration-300 ${
          visibility === "PUBLIC"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
        onClick={() =>
          setVisibility(visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC")
        }
      >
        {visibility === "PUBLIC" ? (
          <FaGlobe className="mr-2" />
        ) : (
          <FaLock className="mr-2" />
        )}
        <span className="font-semibold">
          {visibility === "PUBLIC" ? "Public Moment" : "Private Moment"}
        </span>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 min-h-screen lg:ml-48 lg:w-2/3 md:w-full bg-yellow-300 bg-gradient-to-br mb-10 from-blue-50 via-purple-50  to-pink-50 text-gray-700 p-6 pt-16"
    >
      {currentStep === 1 ? (
        <>
          <PrivacyToggle />
          <div className="mb-6">
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Title..."
              className="mt-1 block w-full font-bold text-2xl bg-gradient-to-br from-blue-50 via-purple-50  to-pink-50 outline-none rounded-md text-gray-700"
              required
            />
          </div>

          {momentSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-6 mb-6">
              <div>
                <div className="flex justify-between">
                  <label className="block text-gray-800 text-sm font-medium mb-2">
                    Image
                  </label>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMomentSection(index)}
                      className="self-start px-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e)}
                  className="hidden"
                  id={`imageUpload-${index}`}
                />

                {section.previewUrl ? (
                  <div className="relative">
                    <Image
                      src={section.previewUrl}
                      alt="Image Preview"
                      width={800}
                      height={200}
                      className="mt-2 w-full h-[200px] object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById(`imageUpload-${index}`)?.click()
                      }
                      className="absolute top-2 right-2 p-1 bg-gray-800 text-gray-800 rounded-full"
                    >
                      <FaEdit />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center w-full p-4 border border-gray-700 border-dashed rounded-md cursor-pointer text-gray-200 hover:text-gray-400"
                    onClick={() =>
                      document.getElementById(`imageUpload-${index}`)?.click()
                    }
                  >
                    <FaCloudUploadAlt
                      size={40}
                      className="mr-2 text-gray-700"
                    />
                    <span className="text-gray-700">Upload Image</span>
                  </div>
                )}
              </div>

              <MentionTextarea
                value={section.caption}
                onChange={(value, mentions) => {
                  const newMomentSections = [...momentSections];
                  newMomentSections[index].caption = value;
                  newMomentSections[index].mentionedUsers = mentions;
                  setMomentSections(newMomentSections);
                }}
                placeholder="Write something about the image..."
                className="min-h-[100px]"
              />
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
            onClick={handleNextStep}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
              id="coverImageUpload"
            />
            <div
              className="flex items-center justify-center w-full p-4 border border-dashed rounded-md cursor-pointer text-gray-700 hover:text-gray-400"
              onClick={() =>
                document.getElementById("coverImageUpload")?.click()
              }
            >
              <FaCloudUploadAlt size={40} className="mr-2 text-gray-700" />
              <span className="text-gray-700">Upload Cover Image</span>
            </div>
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

          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="block w-full p-2 bg-gradient-to-br from-blue-50 via-purple-50  to-pink-50 outline-none rounded-md text-gray-700"
            rows={4}
            placeholder="Describe your moment..."
            required
          ></textarea>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Creating..." : "Create Moment"}
          </button>
        </>
      )}
    </form>
  );
};

export default CreateMoment;
