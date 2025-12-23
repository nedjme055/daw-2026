"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ---------- UI HELPERS ---------- */

function badgeClass(
  kind: "neutral" | "info" | "success" | "warning" | "danger"
) {
  switch (kind) {
    case "info":
      return "bg-blue-500/15 text-blue-200 border-blue-400/20";
    case "success":
      return "bg-green-500/15 text-green-200 border-green-400/20";
    case "warning":
      return "bg-yellow-500/15 text-yellow-200 border-yellow-400/20";
    case "danger":
      return "bg-red-500/15 text-red-200 border-red-400/20";
    default:
      return "bg-white/10 text-white/80 border-white/15";
  }
}

/* ---------- PAGE ---------- */

export default function AdminDashboardPage() {
  const router = useRouter();

  // 🔒 Mock auth (replace later with real auth)
  const currentUser = {
    id: "sa1",
    name: "Super Admin",
    email: "superadmin@platform.com",
    role: "SUPER_ADMIN",
  };

  useEffect(() => {
    if (currentUser.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [router, currentUser.role]);

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 p-4 md:p-6 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-10" />
            <span className="hidden sm:block font-semibold tracking-wide">
              Admin Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border border-white/15">
              <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center font-bold">
                {currentUser.name[0]}
              </div>
              <div className="leading-tight">
                <div className="font-semibold">{currentUser.name}</div>
                <div className="text-xs text-white/70">
                  {currentUser.email}
                </div>
              </div>
              <span
                className={`ml-2 px-2.5 py-1 text-xs rounded-full border ${badgeClass(
                  "info"
                )}`}
              >
                {currentUser.role}
              </span>
            </div>

            <button
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
              onClick={() => alert("Connect logout logic later")}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStat title="Total Users" value="1,248" />
          <AdminStat title="Organizers" value="36" />
          <AdminStat title="Events Created" value="92" />
          <AdminStat title="Active Events" value="7" />
        </div>

        {/* Management Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminPanel title="Users Management">
            <p className="text-white/70">
              Create, disable or assign organizer accounts.
            </p>
            <AdminAction
              label="Manage Users"
              onClick={() => router.push("/dashboard/admin/users")}
            />
          </AdminPanel>

          <AdminPanel title="Events Supervision">
            <p className="text-white/70">
              View all events and suspend invalid ones.
            </p>
            <AdminAction
              label="View Events"
              onClick={() => router.push("/dashboard/admin/events")}
            />
          </AdminPanel>

          <AdminPanel title="Statistics & Reports">
            <p className="text-white/70">
              Global stats, acceptance rates, participation.
            </p>
            <AdminAction
              label="Open Statistics"
              onClick={() => router.push("/dashboard/admin/stats")}
            />
          </AdminPanel>

          <AdminPanel title="System & Security">
            <p className="text-white/70">
              Roles, permissions, platform settings.
            </p>
            <AdminAction
              label="Security Settings"
              onClick={() => router.push("/dashboard/admin/security")}
            />
          </AdminPanel>
        </div>
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function AdminStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white/10 border border-white/15">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
    </div>
  );
}

function AdminPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 border border-white/15">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function AdminAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 border border-blue-300/20 font-semibold transition"
    >
      {label}
    </button>
  );
}
