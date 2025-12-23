'use client';

import { useState } from "react";
import Link from "next/link";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = () => {
  if (!email || !password) {
    setErrorMessage("Please enter both email and password.");
    return;
  }

  // 🔒 MOCK AUTH CHECK
  if (email === "user@gmail.com" && password === "123456") {
    // ✅ SAVE USER
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "Hamza",
        email,
        role: "ORGANIZER", // or SUPER_ADMIN / PARTICIPANT
      })
    );

    setErrorMessage("");

    // ✅ REDIRECT
    window.location.href = "/";
  } else {
    setErrorMessage("Invalid email or password.");
  }
};


  return (
    <div className="min-h-screen w-full bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 flex items-center justify-center p-8 min-h-screen md:min-h-0">
        <div className="w-full max-w-sm space-y-6">
          <div className="w-full max-w-sm space-y-8">
            <Link href="/" >
               <img src="/assets/Asset 1.png" alt="" className="h-10 mb-6"/>
              </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Scientific Event <br />
              <span className="text-blue-300">Platform</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-medium">
              One platform for all your <br className="hidden md:block" />
              health and research events
            </h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg"
              />
              <label className="absolute left-6 top-6 text-white/70 transition-all duration-300
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300
                peer-placeholder-shown:top-6 peer-placeholder-shown:text-base">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg"
              />
              <label className="absolute left-6 top-6 text-white/70 transition-all duration-300
                peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300
                peer-placeholder-shown:top-6 peer-placeholder-shown:text-base">
                Password
              </label>
            </div>

            <div className="flex items-center justify-between mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-5 h-5 bg-white/20 border-white/30 rounded"
                />
                <span className="text-sm text-white/80">Stay signed in</span>
              </label>

              <a href="/forgot" className="text-sm text-white/70 hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              onClick={login}
              className="w-full p-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all rounded-lg"
            >
              Login
            </button>

            {errorMessage && (
              <p className="text-red-300 text-sm text-center">{errorMessage}</p>
            )}

            <p className="text-sm text-white/70">
              New here?{" "}
              <a href="/signup" className="text-blue-300 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-2/3">
        <img
          src="/assets/login.jpg"
          alt="Event Conference"
          className="w-full h-full object-cover brightness-75"
        />
      </div>
    </div>
  );
}
