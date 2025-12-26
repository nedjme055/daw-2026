"use client";

import React, { useEffect, useState, useRef } from "react";
import Dropdown from "./Dropdown";
import Dropdown_feature from "./Dropdown_feature";
import Link from "next/link";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

type UserType = {
  name: string;
  role: "SUPER_ADMIN" | "ORGANIZER" | "PARTICIPANT" | "COMMITTEE";
};

export default function Navbar() {
  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
  }

  function dashboardLink() {
    if (!user) return "/";
    if (user.role === "SUPER_ADMIN") return "/dashboard/admin";
    if (user.role === "ORGANIZER") return "/dashboard/organizer";
    return "/";
  }

  return (
    <nav className="backdrop-blur-sm bg-transparent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-10" />
          </Link>

          {/* Middle */}
          <div className="flex items-center gap-3">
            <Dropdown />
            <Dropdown_feature />
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/signup">
                  <button className="px-6 py-2 rounded-xl border border-one text-one hover:bg-blue-700 transition text-sm">
                    Register
                  </button>
                </Link>

                <Link href="/login">
                  <button className="px-6 py-2 rounded-xl bg-one text-two hover:bg-gray-100 transition text-sm">
                    Login
                  </button>
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Trigger */}
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-semibold">
                    {user.name}
                  </span>
                  <ChevronDown size={16} className="text-white/70" />
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl overflow-hidden">
                    {/* Profile */}
                    <Link
                      href="/profilepage"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition"
                    >
                      <User size={16} />
                      My Profile
                    </Link>

                    {/* Dashboard (ROLE BASED) */}
                    {(user.role === "SUPER_ADMIN" ||
                      user.role === "ORGANIZER") && (
                      <Link
                        href={dashboardLink()}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 transition"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    )}

                    <div className="border-t border-white/10" />

                    {/* Logout */}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
