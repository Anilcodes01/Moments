import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true, email: true, moments: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "User details fetched successfully...",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while fetching user details...",
        error,
      },
      { status: 500 }
    );
  }
}
