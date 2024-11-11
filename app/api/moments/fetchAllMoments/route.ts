import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;


export const GET = async () => {
  try {
    const moments = await prisma.moment.findMany({
      select: {
        id: true,
        coverImage: true,
        caption: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Moments fetched successfully...!",
        moments,
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
