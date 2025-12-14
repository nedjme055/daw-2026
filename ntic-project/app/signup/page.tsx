'use client';

import React, { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signup = () => {
    if (!fullname || !email || !password || !role) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    alert("Account created successfully!");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 flex items-center justify-center p-6 md:p-8 min-h-screen md:min-h-0">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Join the
              <br />
              <span className="text-blue-300">Research Community</span>
            </h1>
            <p className="mt-3 text-lg text-white/70">
              Become part of the platform powering health and scientific events
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-white/20" />
              <span className="text-white/50 text-xs">OR</span>
              <hr className="flex-1 border-white/20" />
            </div>

            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  placeholder="Full Name"
                  className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg transition-all duration-300"
                />
                <label className="absolute left-6 top-6 text-white/70 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-valid:top-2 peer-valid:text-xs peer-valid:text-blue-300">
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg transition-all duration-300"
                />
                <label className="absolute left-6 top-6 text-white/70 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-valid:top-2 peer-valid:text-xs peer-valid:text-blue-300">
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white placeholder-transparent focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg transition-all duration-300"
                />
                <label className="absolute left-6 top-6 text-white/70 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-valid:top-2 peer-valid:text-xs peer-valid:text-blue-300">
                  Password
                </label>
              </div>

              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="peer w-full p-6 bg-white/10 backdrop-blur-sm text-white appearance-none focus:outline-none border-2 border-white/20 focus:border-blue-400 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Select Role
                  </option>
                  <option value="participant">Participant</option>
                  <option value="author">Author / Communicant</option>
                  <option value="committee">Committee Member</option>
                </select>

                <label className="absolute left-6 top-6 text-white/70 pointer-events-none transition-all duration-300 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-valid:top-2 peer-valid:text-xs peer-valid:text-blue-300">
                  Role
                </label>
                <span className="absolute right-6 top-[26px] text-white/50 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember((s) => !s)}
                    className="w-5 h-5 bg-white/10 border-white/20 rounded"
                  />
                  <span className="text-white/70">Save my info</span>
                </label>

                <Link
                  href="/login"
                  className="text-white/70 hover:text-blue-300 transition"
                >
                  Already have account?
                </Link>
              </div>

              <button
                onClick={signup}
                className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer transition-all"
              >
                Sign up
              </button>

              {errorMessage && (
                <p className="text-red-300 text-center text-sm">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-2/3 relative">
        <img
          src="/assets/signup.jpg"
          className="w-full h-full min-h-screen object-cover brightness-75"
          alt="workshop"
        />
      </div>
    </div>
  );
}