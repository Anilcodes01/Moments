import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Visibility } from "@prisma/client";

export const revalidate = 0;

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const moments = await prisma.moment.findMany({
      where: {
        
        visibility: Visibility.PUBLIC
      },
      select: {
        id: true,
        coverImage: true,
        description: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        likes: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    const momentWithStatus = moments.map((moment) => ({
      ...moment,
      isLiked: moment.likes.length > 0,
      likeCount: moment._count.likes,
    }));

    return NextResponse.json(
      {
        message: "Public moments fetched successfully...!",
        moments: momentWithStatus,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while fetching moments...",
        error,
      },
      { status: 500 }
    );
  }
};