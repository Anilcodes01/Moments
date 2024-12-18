import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
   
    const moment = await prisma.moment.findUnique({
      where: { id },
      include: {
        tags: true,
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

  
    const sortedMedia = moment.media.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    
    return NextResponse.json({ ...moment, media: sortedMedia });
  }  catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching moment:', error.message, error.stack);
    } else {
      console.error('Unknown error:', error);
    }
  
    return NextResponse.json({ 
      message: 'Failed to fetch moment', 
      error
    
    }, { status: 500 });
  }
  
}
