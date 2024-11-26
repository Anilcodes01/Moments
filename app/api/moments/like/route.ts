import { prisma } from "@/app/lib/prisma";
import { connect } from "http2";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { momentId, userId } = await req.json();

    const existingLike = await prisma.like.findUnique({
      where: {
        momentId_userId: {
          momentId,
          userId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        {
          message: "Post already liked",
        },
        { status: 400 }
      );
    }

    const like = await prisma.like.create({
      data: {
        moment: { connect: { id: momentId } },
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(like);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error liking the momnet",
        error,
      },
      { status: 500 }
    );
  }
}
