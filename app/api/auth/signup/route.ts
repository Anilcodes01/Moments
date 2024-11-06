import {prisma} from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, name, password, avatarUrl, username }: {email: string, name: string, password: string, avatarUrl: string, username: string} = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User with this email already exists!",
          success: false,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        avatarUrl,
        password: hashedPassword,
       
      },
    });
    return NextResponse.json(
      {
        message: "User created successfully!",
        newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while registering the User...",
        error,
        success: false,
      },
      { status: 500 }
    );
  }
}
