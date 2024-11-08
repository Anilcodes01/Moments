import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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
      { status: 200 }
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
}
