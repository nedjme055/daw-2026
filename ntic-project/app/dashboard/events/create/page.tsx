"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type EventStatus = "DRAFT" | "PUBLISHED";

export default function CreateEventPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    theme: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    registrationDeadline: "",
    isPaid: false,

    cfpEnabled: false,
    cfpStart: "",
    cfpDeadline: "",

    status: "DRAFT" as EventStatus,
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.title || !form.theme || !form.startDate || !form.endDate) {
      alert("Please fill all required fields.");
      return false;
    }

    if (form.cfpEnabled && (!form.cfpStart || !form.cfpDeadline)) {
      alert("CFP dates are required when CFP is enabled.");
      return false;
    }

    return true;
  }

 async function handleSubmit() {
  if (!validate()) return;

  setLoading(true);

  try {
    const payload = {
      title: form.title,
      theme: form.theme,
      description: form.description,
      location: form.location,

      start_date: form.startDate,
      end_date: form.endDate,

      max_participants: form.maxParticipants
        ? Number(form.maxParticipants)
        : null,

      registration_deadline: form.registrationDeadline || null,

      is_paid: form.isPaid,

      cfp_enabled: form.cfpEnabled,
      cfp_start: form.cfpEnabled ? form.cfpStart : null,
      cfp_deadline: form.cfpEnabled ? form.cfpDeadline : null,

      status: form.status,
    };

    await apiFetch("/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    router.push("/dashboard/events");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to create event";
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-white/80 hover:text-white transition"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mt-2">Create Event</h1>
          <p className="text-white/70">
            Configure a new scientific or academic event.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Section title="Event Information">
            <Input
              label="Event Title *"
              value={form.title}
              onChange={(v) => update("title", v)}
            />
            <Input
              label="Theme / Category *"
              value={form.theme}
              onChange={(v) => update("theme", v)}
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v) => update("description", v)}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(v) => update("location", v)}
            />
          </Section>

          <Section title="Schedule">
            <Input
              type="date"
              label="Start Date *"
              value={form.startDate}
              onChange={(v) => update("startDate", v)}
            />
            <Input
              type="date"
              label="End Date *"
              value={form.endDate}
              onChange={(v) => update("endDate", v)}
            />
          </Section>

          <Section title="Registration">
            <Input
              type="number"
              label="Maximum Participants"
              value={form.maxParticipants}
              onChange={(v) => update("maxParticipants", v)}
            />
            <Input
              type="date"
              label="Registration Deadline"
              value={form.registrationDeadline}
              onChange={(v) => update("registrationDeadline", v)}
            />

            <Toggle
              label="Paid Event"
              checked={form.isPaid}
              onChange={(v) => update("isPaid", v)}
            />
          </Section>

          <Section title="Call For Papers (CFP)">
            <Toggle
              label="Enable CFP"
              checked={form.cfpEnabled}
              onChange={(v) => update("cfpEnabled", v)}
            />

            {form.cfpEnabled && (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="CFP Start Date"
                  value={form.cfpStart}
                  onChange={(v) => update("cfpStart", v)}
                />
                <Input
                  type="date"
                  label="CFP Deadline"
                  value={form.cfpDeadline}
                  onChange={(v) => update("cfpDeadline", v)}
                />
              </div>
            )}
          </Section>

          <Section title="Publication">
            <Select
              label="Event Status"
              value={form.status}
              onChange={(v) => update("status", v as EventStatus)}
              options={[
                { value: "DRAFT", label: "Draft (not visible)" },
                { value: "PUBLISHED", label: "Published" },
              ]}
            />
          </Section>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>

            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== UI COMPONENTS ================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-white/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-blue-400/40"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 md:col-span-2">
      <label className="text-sm text-white/80">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 outline-none resize-none"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className="accent-blue-500 w-4 h-4"
      />
      <span className="text-white/80">{label}</span>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-white/80">{label}</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-black">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
