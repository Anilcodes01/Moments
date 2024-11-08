import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Fetch the moment with related media and user data
    const moment = await prisma.moment.findUnique({
      where: { id },
      include: {
        media: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!moment) {
      return NextResponse.json({ error: 'Moment not found' }, { status: 404 });
    }

    // Sort the media by the createdAt field (ascending order)
    const sortedMedia = moment.media.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Return the moment with the sorted media
    return NextResponse.json({ ...moment, media: sortedMedia });
  } catch (error) {
    console.error('Error fetching moment:', error);
    return NextResponse.json({ error: 'Failed to fetch moment' }, { status: 500 });
  }
}
