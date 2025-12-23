"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ---------- TYPES ---------- */

type EventStatus =
  | "DRAFT"
  | "CFP_OPEN"
  | "REVIEW"
  | "ONGOING"
  | "CLOSED"
  | "SUSPENDED";

interface AdminEvent {
  id: string;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  participants: number;
}

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

function statusMeta(status: EventStatus) {
  switch (status) {
    case "CFP_OPEN":
      return { label: "CFP Open", kind: "info" as const };
    case "ONGOING":
      return { label: "Ongoing", kind: "success" as const };
    case "REVIEW":
      return { label: "Under Review", kind: "warning" as const };
    case "CLOSED":
      return { label: "Closed", kind: "neutral" as const };
    case "SUSPENDED":
      return { label: "Suspended", kind: "danger" as const };
    default:
      return { label: "Draft", kind: "neutral" as const };
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

/* ---------- PAGE ---------- */

export default function AdminEventsPage() {
  const router = useRouter();

  // 🔒 Mock admin
  const currentUser = {
    name: "Super Admin",
    email: "superadmin@platform.com",
    role: "SUPER_ADMIN",
  };

  useEffect(() => {
    if (currentUser.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [router, currentUser.role]);

  const [events, setEvents] = useState<AdminEvent[]>([
    {
      id: "e1",
      title: "Vaccination Drive Week",
      organizer: "University of Constantine",
      startDate: "2025-01-10",
      endDate: "2025-01-12",
      status: "CFP_OPEN",
      participants: 120,
    },
    {
      id: "e2",
      title: "Mental Health Awareness Seminar",
      organizer: "Health NGO Oran",
      startDate: "2025-02-05",
      endDate: "2025-02-05",
      status: "ONGOING",
      participants: 300,
    },
    {
      id: "e3",
      title: "Cardiology Research Day",
      organizer: "Algiers Medical School",
      startDate: "2025-03-01",
      endDate: "2025-03-02",
      status: "REVIEW",
      participants: 90,
    },
  ]);

  function suspendEvent(id: string) {
    if (!confirm("Are you sure you want to suspend this event?")) return;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "SUSPENDED" } : e
      )
    );
  }

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Header (same as admin dashboard) */}
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard/admin" className="flex items-center gap-3">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-9" />
            <span className="font-semibold hidden sm:block">
              Admin · Events
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
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <h1 className="text-3xl font-bold">Events Supervision</h1>
        <p className="text-white/70">
          Monitor all events created on the platform. Admin actions are limited
          to supervision and moderation.
        </p>

        <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <TableHead>Event</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const meta = statusMeta(e.status);
                return (
                  <tr
                    key={e.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <TableCell className="font-semibold">
                      {e.title}
                    </TableCell>
                    <TableCell>{e.organizer}</TableCell>
                    <TableCell>
                      {formatDate(e.startDate)} →{" "}
                      {formatDate(e.endDate)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${badgeClass(
                          meta.kind
                        )}`}
                      >
                        {meta.label}
                      </span>
                    </TableCell>
                    <TableCell>{e.participants}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            router.push(`/event/${e.id}`)
                          }
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
                        >
                          View
                        </button>

                        {e.status !== "SUSPENDED" && (
                          <button
                            onClick={() => suspendEvent(e.id)}
                            className="px-3 py-2 rounded-xl bg-red-600/70 hover:bg-red-600 border border-red-300/20 transition"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="p-4 text-left text-sm font-semibold text-white/80">
      {children}
    </th>
  );
}

function TableCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`p-4 text-white/80 ${className}`}>{children}</td>
  );
}
