import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { momentId } = await req.json();

  try {


    await prisma.media.deleteMany({
        where: {
          momentId: momentId,
        },
      });

      
    const deletedMoment = await prisma.moment.delete({
      where: {
        id: momentId,
      },
    });
    return NextResponse.json(
      {
        message: "Moment deleted successfully",
        deletedMoment,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while deleting the moment",
        error
      },
      { status: 500 }
    );
  }
}
