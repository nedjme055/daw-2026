'use client';

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      alert("Please enter a valid email.");
      return;
    }

    router.push("/entercode");
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        
        {/* TITLE */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Forgot Your <br />
            <span className="text-blue-300">Password?</span>
          </h1>

          <p className="text-xl md:text-2xl font-medium text-white/80 leading-snug">
            Enter your email and we will send you a reset link
            <br className="hidden md:block" />
            to regain access to your account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent 
                         focus:outline-none border-2 border-white/20 focus:border-blue-400
                         rounded-lg transition-all duration-300"
            />

            <label
              className="absolute left-6 top-6 text-white/70 pointer-events-none transition-all duration-300
                         peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300
                         peer-placeholder-shown:top-6 peer-placeholder-shown:text-base
                         peer-valid:top-2 peer-valid:text-xs peer-valid:text-blue-300"
            >
              Email
            </label>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg 
                       hover:bg-blue-700 transition-all cursor-pointer"
          >
            Reset Password
          </button>

          <p className="text-center text-sm text-white/70">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-blue-300 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}