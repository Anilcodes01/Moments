// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    name?: string | null;
    email?: string;
    avatarUrl?: string;
   
  }

  interface Session {
    user: User;
  }
}
