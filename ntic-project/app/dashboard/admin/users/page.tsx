"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ---------- TYPES ---------- */

type UserRole =
  | "SUPER_ADMIN"
  | "ORGANIZER"
  | "AUTHOR"
  | "COMMITTEE"
  | "PARTICIPANT";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
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

function roleMeta(role: UserRole) {
  switch (role) {
    case "SUPER_ADMIN":
      return { label: "Super Admin", kind: "danger" as const };
    case "ORGANIZER":
      return { label: "Organizer", kind: "info" as const };
    case "COMMITTEE":
      return { label: "Committee", kind: "warning" as const };
    case "AUTHOR":
      return { label: "Author", kind: "neutral" as const };
    default:
      return { label: "Participant", kind: "success" as const };
  }
}

/* ---------- PAGE ---------- */

export default function AdminUsersPage() {
  const router = useRouter();

  const currentUser = {
    role: "SUPER_ADMIN",
  };

  useEffect(() => {
    if (currentUser.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [router, currentUser.role]);

  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "u1",
      name: "Mouheb",
      email: "Mouheb@mail.com",
      role: "ORGANIZER",
      active: true,
    },
    {
      id: "u2",
      name: "Nedjme",
      email: "nedjme@mail.com",
      role: "AUTHOR",
      active: true,
    },
    {
      id: "u3",
      name: "Raouf",
      email: "raouf@mail.com",
      role: "COMMITTEE",
      active: false,
    },
    {
      id: "u4",
      name: "Jad",
      email: "Jad@mail.com",
      role: "PARTICIPANT",
      active: true,
    },
  ]);

  function toggleUser(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    );
  }

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard/admin" className="flex items-center gap-3">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-9" />
            <span className="font-semibold hidden sm:block">
              Admin · Users
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
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-white/70">
          Manage platform users, roles and access status.
        </p>

        <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const roleInfo = roleMeta(u.role);
                return (
                  <tr
                    key={u.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <TableCell className="font-semibold">
                      {u.name}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${badgeClass(
                          roleInfo.kind
                        )}`}
                      >
                        {roleInfo.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          u.active
                            ? badgeClass("success")
                            : badgeClass("danger")
                        }`}
                      >
                        {u.active ? "Active" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleUser(u.id)}
                        className={`px-3 py-2 rounded-xl border transition ${
                          u.active
                            ? "bg-red-600/70 hover:bg-red-600 border-red-300/20"
                            : "bg-green-600/70 hover:bg-green-600 border-green-300/20"
                        }`}
                      >
                        {u.active ? "Disable" : "Enable"}
                      </button>
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
