
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/authOptions';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const caption = formData.get('caption') as string;
    const coverImageFile = formData.get('coverImage') as File | null;
    const mediaFiles = formData.getAll('media') as File[];

    // Upload cover image to Cloudinary if it exists
    let coverImageUrl = '';
    if (coverImageFile) {
      const buffer = await coverImageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${coverImageFile.type};base64,${base64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'moments/cover_images',
        resource_type: 'image',
      });
      coverImageUrl = result.secure_url;
    }

    // Create moment in the database
    const moment = await prisma.moment.create({
      data: {
        title,
        caption,
        coverImage: coverImageUrl,
        userId: session.user.id,
      },
    });

    // Upload media files to Cloudinary
    const mediaPromises = mediaFiles.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataURI = `data:${file.type};base64,${base64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        folder: 'moments',
      });

      return prisma.media.create({
        data: {
          url: result.secure_url,
          type: file.type.includes('video') ? 'VIDEO' : 'PHOTO',
          momentId: moment.id,
          caption: '',
        },
      });
    });

    const media = await Promise.all(mediaPromises);

    return NextResponse.json({ moment, media });
  } catch (error) {
    console.error('Error creating moment:', error);
    return NextResponse.json(
      { error: 'Failed to create moment' },
      { status: 500 }
    );
  }
}
