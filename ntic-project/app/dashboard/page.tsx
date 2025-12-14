"use client";

import { useState } from "react";
import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  maxCapacity: number;
  status: "upcoming" | "ongoing" | "completed";
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedDate: string;
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<"events" | "users">(
    "events"
  );

  const events: EventItem[] = [
    {
      id: "1",
      title: "Vaccination Drive Week",
      date: "2025-01-10",
      location: "Constantine",
      participants: 120,
      maxCapacity: 200,
      status: "upcoming",
      category: "Health",
    },
    {
      id: "2",
      title: "Mental Health Awareness Seminar",
      date: "2025-02-05",
      location: "Oran",
      participants: 300,
      maxCapacity: 300,
      status: "ongoing",
      category: "Health",
    },
  ];

  const users: User[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      joinedDate: "2025-12-12",
    },
    {
      id: "2",
      name: "Regular User",
      email: "user@example.com",
      role: "user",
      joinedDate: "2025-12-12",
    },
  ];

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] flex flex-col">
      {/* HEADER LOGO */}
      <header className="p-6 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <img
            src="/assets/Asset 1.png"
            alt="Main Page"
            className="h-10 cursor-pointer transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex flex-1 min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-64 p-6 bg-white/10 backdrop-blur-md border-r border-white/20">
          <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

          <nav className="space-y-3">
            <button
              onClick={() => setActiveSection("events")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeSection === "events"
                  ? "bg-blue-600/80 shadow-lg"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              Events
            </button>

            <button
              onClick={() => setActiveSection("users")}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeSection === "users"
                  ? "bg-blue-600/80 shadow-lg"
                  : "hover:bg-white/10 text-white/80"
              }`}
            >
              Users
            </button>
          </nav>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 p-10">
          <h2 className="text-3xl font-semibold mb-8 capitalize">
            {activeSection}
          </h2>

          {/* EVENTS SECTION */}
          {activeSection === "events" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600/40">
                  <tr>
                    <th className="p-4 text-left">Title</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Participants</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-t border-white/10 hover:bg-white/10 transition"
                    >
                      <td className="p-4">{event.title}</td>
                      <td className="p-4">{event.date}</td>
                      <td className="p-4">{event.location}</td>
                      <td className="p-4">
                        {event.participants}/{event.maxCapacity}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === "upcoming"
                              ? "bg-blue-500/20 text-blue-300"
                              : event.status === "ongoing"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* USERS SECTION */}
          {activeSection === "users" && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600/40">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Joined</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-white/10 hover:bg-white/10 transition"
                    >
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize">{user.role}</td>
                      <td className="p-4">{user.joinedDate}</td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button className="px-4 py-1.5 bg-blue-600/80 rounded-lg hover:bg-blue-500 transition">
                            Edit
                          </button>
                          <button className="px-4 py-1.5 bg-red-600/80 rounded-lg hover:bg-red-500 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
