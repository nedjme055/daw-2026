"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function AdminSecurityPage() {
  const router = useRouter();

  const currentUser = { role: "SUPER_ADMIN" };

  useEffect(() => {
    if (currentUser.role !== "SUPER_ADMIN") {
      router.replace("/dashboard");
    }
  }, [router, currentUser.role]);

  /* ---- MOCK SECURITY SETTINGS ---- */
  const [settings, setSettings] = useState({
    registrationsOpen: true,
    maintenanceMode: false,
    forcePasswordReset: false,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard/admin" className="flex items-center gap-3">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-9" />
            <span className="font-semibold hidden sm:block">
              Admin · Security
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
        <h1 className="text-3xl font-bold">Security & Access Control</h1>
        <p className="text-white/70">
          Manage platform security rules, access control and monitoring.
        </p>

        {/* Role Access */}
        <Panel title="Role-Based Access Control">
          <AccessRow role="Super Admin" access="Full platform access" />
          <AccessRow role="Organizer" access="Event management only" />
          <AccessRow role="Committee" access="Evaluation & review" />
          <AccessRow role="Author" access="Submissions & revisions" />
          <AccessRow role="Participant" access="Registration & attendance" />
        </Panel>

        {/* Security Toggles */}
        <Panel title="Platform Security Settings">
          <Toggle
            label="Open user registrations"
            value={settings.registrationsOpen}
            onChange={() => toggle("registrationsOpen")}
          />
          <Toggle
            label="Maintenance mode"
            value={settings.maintenanceMode}
            onChange={() => toggle("maintenanceMode")}
          />
          <Toggle
            label="Force password reset for all users"
            value={settings.forcePasswordReset}
            onChange={() => toggle("forcePasswordReset")}
          />
        </Panel>

        {/* Audit Logs */}
        <Panel title="Audit Log (Preview)">
          <AuditItem
            text="Admin suspended event 'Cardiology Research Day'"
            date="2025-02-10 14:32"
          />
          <AuditItem
            text="User 'H. Ouali' disabled by admin"
            date="2025-02-09 11:18"
          />
          <AuditItem
            text="Maintenance mode enabled"
            date="2025-02-08 22:05"
          />
        </Panel>
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

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
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function AccessRow({
  role,
  access,
}: {
  role: string;
  access: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-2">
      <span className="font-semibold">{role}</span>
      <span
        className={`px-3 py-1 rounded-full text-xs border ${badgeClass(
          "info"
        )}`}
      >
        {access}
      </span>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/80">{label}</span>
      <button
        onClick={onChange}
        className={`px-4 py-1 rounded-full border transition ${
          value
            ? badgeClass("success")
            : badgeClass("warning")
        }`}
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function AuditItem({
  text,
  date,
}: {
  text: string;
  date: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between text-sm border-b border-white/10 pb-2">
      <span className="text-white/80">{text}</span>
      <span className="text-white/60">{date}</span>
    </div>
  );
}
