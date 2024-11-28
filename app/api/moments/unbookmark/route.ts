import { authOptions } from "@/app/lib/authOptions";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    const { momentId } = await req.json();
    const userId = session?.user.id;

    await prisma.bookmark.deleteMany({
      where: {
        userId,
        momentId,
      },
    });
    return NextResponse.json(
      {
        message: "Post unbookmarked successfully...!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to unbookmark the moment...!",
      },
      { status: 500 }
    );
  }
};
