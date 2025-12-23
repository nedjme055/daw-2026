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

export default function AdminStatsPage() {
  const router = useRouter();

  const currentUser = { role: "SUPER_ADMIN" };

  useEffect(() => {
    if (currentUser.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [router, currentUser.role]);

  /* ---- MOCK STATS ---- */
  const stats = {
    users: 1248,
    events: 92,
    submissions: 614,
    accepted: 238,
    usersByRole: {
      ORGANIZER: 36,
      COMMITTEE: 58,
      AUTHOR: 214,
      PARTICIPANT: 940,
    },
    eventsByStatus: {
      DRAFT: 12,
      CFP_OPEN: 18,
      REVIEW: 21,
      ONGOING: 7,
      CLOSED: 34,
    },
  };

  const acceptanceRate = Math.round(
    (stats.accepted / stats.submissions) * 100
  );

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard/admin" className="flex items-center gap-3">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-9" />
            <span className="font-semibold hidden sm:block">
              Admin · Statistics
            </span>
          </Link>

          <button
            onClick={() => router.push("/dashboard/admin")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        <h1 className="text-3xl font-bold">Platform Statistics</h1>
        <p className="text-white/70">
          Global indicators about users, events and scientific activity.
        </p>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.users} />
          <StatCard title="Total Events" value={stats.events} />
          <StatCard title="Submissions" value={stats.submissions} />
          <StatCard title="Acceptance Rate" value={`${acceptanceRate}%`} />
        </div>

        {/* Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title="Users by Role">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <RowStat
                key={role}
                label={role}
                value={count}
                total={stats.users}
              />
            ))}
          </Panel>

          <Panel title="Events by Status">
            {Object.entries(stats.eventsByStatus).map(([status, count]) => (
              <RowStat
                key={status}
                label={status}
                value={count}
                total={stats.events}
              />
            ))}
          </Panel>
        </div>
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white/10 border border-white/15">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 border border-white/15">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RowStat({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percent = Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/80">{label}</span>
        <span className="text-white/70">
          {value} ({percent}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full ${badgeClass("info")}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
