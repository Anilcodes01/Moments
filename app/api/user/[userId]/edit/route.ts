import cloudinary from "cloudinary";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResponse {
  secure_url: string;
}

const uploadToCloudinary = (
  buffer: Buffer,
  publicId: string
): Promise<CloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "profile_pictures",
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as CloudinaryResponse);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await getServerSession(authOptions);
  const { userId } = params;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const currentUserId = session.user.id;

  if (currentUserId !== userId) {
    return NextResponse.json(
      {
        message: "You can only edit your own profile",
      },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  const bio = formData.get("bio")?.toString();
  const avatarFile = formData.get("avatar");

  try {
    const currendUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currendUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const updateData: {
      name?: string;
      bio?: string;
      avatarUrl?: string;
    } = {
      name: name || currendUser.name || undefined,
      bio: bio || currendUser.bio || undefined,
    };

    if (avatarFile && avatarFile instanceof File) {
      const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());
      const avatarUploadResponse = await uploadToCloudinary(
        avatarBuffer,
        `${currentUserId}_avatar`
      );
      if (avatarUploadResponse?.secure_url) {
        updateData.avatarUrl = avatarUploadResponse.secure_url;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while editing the profile, Please try again later...",
        error,
      },
      { status: 500 }
    );
  }
}
