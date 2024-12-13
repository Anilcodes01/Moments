import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const formData = await request.formData();

    const existingMoment = await prisma.moment.findUnique({
      where: { id },
    });

    if (!existingMoment) {
      return NextResponse.json({ error: "Moment not found" }, { status: 404 });
    }

    const mediaPromises = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("media_"))
      .map(async ([key, value], index) => {
        console.log(key);
        const file = value as File;
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const dataURI = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          resource_type: "auto",
          folder: "moments",
        });

        const caption = (formData.get(`caption_${index}`) as string) || "";

      
        return prisma.media.create({
          data: {
            url: result.secure_url,
            type: file.type.includes("video") ? "VIDEO" : "PHOTO",
            momentId: existingMoment.id,
            caption,
          },
        });
      });

    const media = await Promise.all(mediaPromises);

    return NextResponse.json({ moment: existingMoment, media });
  } catch (error) {
    console.error("Error updating moment:", error);

    return NextResponse.json(
      { error: "Failed to update moment" },
      { status: 500 }
    );
  }
}
