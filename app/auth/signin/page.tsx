"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async () => {
    if (!email || !password) {
      toast.error("All fields are required!");
    }
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.ok) {
        toast.success("Successfully signed in!");
        router.push("/");
      } else {
        toast.error("Sign-in failed! Please check your credentials.");
      }
    } catch (error) {
      toast.error("Error while signing in. Please try again.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      toast.error("Google sign-in failed!");
      console.log(error)
    }
  };

  return (
    <div className="bg-white min-h-screen  flex justify-center items-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white h-auto text-black lg:w-1/3  rounded-xl shadow-2xl p-10">
      
        <div className="text-4xl  text-left">Welcome back!</div>
        <div className="text-sm mt-1">Enter your credentials to access your account</div>
        <div className="mt-8">
          <div className="flex flex-col">
            <label className="font-medium text-sm" htmlFor="name">
              Email
            </label>
            <input
              value={email}
              className="rounded-xl border text-sm p-2 mb-4 outline-none "
              type="text"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium text-sm" htmlFor="name">
              Password
            </label>
            <input
              value={password}
              className="rounded-xl p-2 text-sm border mb-6 outline-none "
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="flex text-sm ">
            <input
              className="rounded-md p-1  outline-none  "
              type="checkbox"
              placeholder="Enter your password"
            />
            <p className="ml-1">I agree to the</p>
            <p className="underline ml-1">terms and policies</p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSignin}
              className="bg-green-700 text-white p-1 w-full rounded-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Signin"}
            </button>
          </div>

          <div className="flex justify-center mt-8 mb-8">
            <p>or</p>
          </div>

          <div className="flex  text-sm gap-4 jusitfy-center">
            <button onClick={handleGoogleSignin} className="bg-white border p-1 w-full hover:bg-slate-100 rounded-lg">
              Sign in with Google
            </button>
            <button className="bg-white border p-1 w-full hover:bg-slate-100 rounded-lg">
              Sign in with Github
            </button>
          </div>
          <div className="flex text-sm justify-center mt-4">
            <p>Don&apos;t have an account?</p>
            <button
              onClick={() => {
                router.push("/auth/signup");
              }}
              className="ml-1 text-blue-700 font-medium"
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
