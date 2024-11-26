import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { momentId, userId } = await req.json();

    if (!momentId || !userId) {
      return NextResponse.json(
        { error: "Missing momentId or userId" },
        { status: 400 }
      );
    }

    const result = await prisma.like.deleteMany({
      where: {
        momentId,
        userId,
      },
    });

    console.log("Deleted likes count:", result.count);

    return NextResponse.json(
      {
        message: "Post unliked",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to unlike the post",
        error,
      },
      { status: 500 }
    );
  }
}
