// File: /pages/api/users/search.ts
import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "@/app/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Invalid query parameter" });
    }

    try {
      const users = await prisma.user.findMany({
        where: {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          username: true,
        },
        take: 10, // Limit results
      });

      res.status(200).json({ users });
    } catch (error) {
      console.error("Failed to fetch users", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
