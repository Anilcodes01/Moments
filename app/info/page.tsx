"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function InfoPage() {
  const router = useRouter();

  const handleGoogleSignin = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      toast.error("Google sign-in failed!");
      console.log(error);
    }
  };

  return (
    <div className=" flex flex-col justify-center min-h-screen w-full items-center  p-4">
      <div className="flex flex-col  items-center ">
        <div className="text-4xl font-bold ">Moments</div>
        <p className="text-center pt-2 pl-4 pr-4">
          One stop place to save all your moments and memories...!
        </p>
      </div>

      <div className="mt-12 w-5/6 text-center">
        <div className="text-3xl font-bold">Join now</div>

        <button
          onClick={handleGoogleSignin}
          className="border rounded-full px-4 py-2 w-full mt-4"
        >
          Sign in with Google
        </button>

        <div className="flex items-center my-2">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-2 text-white ">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button
          onClick={() => {
            router.push("/auth/signup");
          }}
          className="border rounded-full px-4 py-2 w-full bg-white text-black"
        >
          Create Account
        </button>
      </div>

      <div className="w-5/6 mt-16">
        <p className=" mb-4 font-semibold w-full">Already have an account?</p>
        <button
          onClick={() => {
            router.push("/auth/signin");
          }}
          className="border rounded-full w-full text-blue-500 px-4 py-2 font-bold"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
