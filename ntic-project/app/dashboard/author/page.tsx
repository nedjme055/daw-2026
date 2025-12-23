"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* =========================================================
   Author Submissions Page (DAW2-aligned, Frontend-only)
   Path: /dashboard/author/submissions
   - Functional workflows (view, resubmit, withdraw)
   - LocalStorage persistence
   - Role-oriented UI (Author)
========================================================= */

type SubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVISION"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

type SubmissionType = "ORAL" | "POSTER" | "DISPLAY";

type EventStatus = "CFP_OPEN" | "REVIEW" | "PUBLISHED" | "ONGOING" | "CLOSED";

type Role = "AUTHOR";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthorSubmission = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventStatus: EventStatus;

  title: string;
  type: SubmissionType;

  submittedAt?: string; // ISO
  updatedAt: string; // ISO

  status: SubmissionStatus;

  // author abilities
  canEdit: boolean; // drafts only
  canResubmit: boolean; // revision only

  // UI extras
  track?: "AI" | "Cardiology" | "Public Health" | "Mental Health";
  keywords?: string[];
};

const STORAGE_KEY = "author_submissions_v1";

/* =========================
   Small helpers
========================= */

function isoNow() {
  return new Date().toISOString();
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function statusMeta(status: SubmissionStatus) {
  switch (status) {
    case "DRAFT":
      return { label: "Draft", tone: "neutral" as const };
    case "SUBMITTED":
      return { label: "Submitted", tone: "info" as const };
    case "UNDER_REVIEW":
      return { label: "Under review", tone: "warning" as const };
    case "REVISION":
      return { label: "Revision requested", tone: "purple" as const };
    case "ACCEPTED":
      return { label: "Accepted", tone: "success" as const };
    case "REJECTED":
      return { label: "Rejected", tone: "danger" as const };
    case "WITHDRAWN":
      return { label: "Withdrawn", tone: "muted" as const };
  }
}

function badgeClass(tone: ReturnType<typeof statusMeta>["tone"]) {
  switch (tone) {
    case "success":
      return "bg-emerald-500/15 text-emerald-200 border-emerald-400/25";
    case "danger":
      return "bg-rose-500/15 text-rose-200 border-rose-400/25";
    case "warning":
      return "bg-amber-500/15 text-amber-200 border-amber-400/25";
    case "info":
      return "bg-sky-500/15 text-sky-200 border-sky-400/25";
    case "purple":
      return "bg-violet-500/15 text-violet-200 border-violet-400/25";
    case "muted":
      return "bg-white/5 text-white/60 border-white/10";
    default:
      return "bg-white/10 text-white/80 border-white/15";
  }
}

function typePill(type: SubmissionType) {
  switch (type) {
    case "ORAL":
      return { label: "Oral", cls: "bg-white/10 border-white/15 text-white/90" };
    case "POSTER":
      return { label: "Poster", cls: "bg-white/10 border-white/15 text-white/90" };
    case "DISPLAY":
      return { label: "Display", cls: "bg-white/10 border-white/15 text-white/90" };
  }
}

/* =========================
   SVG Icons (no emojis)
========================= */

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconFilter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}

function IconEye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
      />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );
}

function IconEdit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
      />
    </svg>
  );
}

function IconUpload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 10l5-5 5 5" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14" />
    </svg>
  );
}

function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconBolt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}


export default function AuthorSubmissionsPage() {
  const router = useRouter();
  
  const currentUser: CurrentUser = {
    id: "author-1",
    name: "Dr. Hamza Mouheb",
    email: "hamza.mouheb@author.com",
    role: "AUTHOR",
  };

  // Data state (persisted)
  const [items, setItems] = useState<AuthorSubmission[]>([]);
  const [ready, setReady] = useState(false);

  // Filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<SubmissionStatus | "ALL">("ALL");
  const [eventId, setEventId] = useState<string | "ALL">("ALL");
  const [type, setType] = useState<SubmissionType | "ALL">("ALL");

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
        setReady(true);
        return;
      } catch {
        // ignore
      }
    }

    // Seed initial believable data
    const seeded: AuthorSubmission[] = [
      {
        id: "sub-101",
        eventId: "ev-1",
        eventTitle: "Public Health Conference 2026",
        eventStatus: "CFP_OPEN",
        title: "Predictors of Vaccine Hesitancy in Urban Communities",
        type: "ORAL",
        submittedAt: "2025-12-05T10:10:00.000Z",
        updatedAt: "2025-12-05T10:10:00.000Z",
        status: "UNDER_REVIEW",
        canEdit: false,
        canResubmit: false,
        track: "Public Health",
        keywords: ["vaccination", "survey", "behavior"],
      },
      {
        id: "sub-102",
        eventId: "ev-2",
        eventTitle: "Cardiology Research Day",
        eventStatus: "REVIEW",
        title: "ECG Signal Classification Using Lightweight Transformers",
        type: "POSTER",
        submittedAt: "2025-11-28T14:40:00.000Z",
        updatedAt: "2025-12-10T09:15:00.000Z",
        status: "REVISION",
        canEdit: false,
        canResubmit: true,
        track: "Cardiology",
        keywords: ["ECG", "transformers", "classification"],
      },
      {
        id: "sub-103",
        eventId: "ev-3",
        eventTitle: "AI & Health Symposium",
        eventStatus: "PUBLISHED",
        title: "Bias Auditing in Clinical NLP Pipelines",
        type: "ORAL",
        submittedAt: "2025-10-20T08:00:00.000Z",
        updatedAt: "2025-11-02T16:22:00.000Z",
        status: "ACCEPTED",
        canEdit: false,
        canResubmit: false,
        track: "AI",
        keywords: ["NLP", "bias", "clinical"],
      },
      {
        id: "sub-104",
        eventId: "ev-1",
        eventTitle: "Public Health Conference 2026",
        eventStatus: "CFP_OPEN",
        title: "Draft: Community Health Workers Data Collection Protocol",
        type: "DISPLAY",
        updatedAt: "2025-12-18T12:00:00.000Z",
        status: "DRAFT",
        canEdit: true,
        canResubmit: false,
        track: "Public Health",
        keywords: ["protocol", "fieldwork"],
      },
    ];

    setItems(seeded);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    setReady(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  // Derived lists for dropdowns
  const events = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    for (const it of items) map.set(it.eventId, { id: it.eventId, title: it.eventTitle });
    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [items]);

  // Counters (top stats)
  const counters = useMemo(() => {
    const total = items.filter((i) => i.status !== "WITHDRAWN").length;
    const accepted = items.filter((i) => i.status === "ACCEPTED").length;
    const review = items.filter((i) => i.status === "UNDER_REVIEW" || i.status === "SUBMITTED").length;
    const revision = items.filter((i) => i.status === "REVISION").length;
    const drafts = items.filter((i) => i.status === "DRAFT").length;

    return { total, accepted, review, revision, drafts };
  }, [items]);

  // Filtering
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items
      .filter((x) => {
        if (status !== "ALL" && x.status !== status) return false;
        if (eventId !== "ALL" && x.eventId !== eventId) return false;
        if (type !== "ALL" && x.type !== type) return false;

        if (!query) return true;
        const hay = `${x.title} ${x.eventTitle} ${x.track ?? ""} ${(x.keywords ?? []).join(" ")}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [items, q, status, eventId, type]);

  // Actions
  function withdraw(id: string) {
    const target = items.find((x) => x.id === id);
    if (!target) return;

    const ok = confirm(`Withdraw "${target.title}"?\n\nThis is reversible only by re-submitting.`);
    if (!ok) return;

    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "WITHDRAWN",
              canEdit: false,
              canResubmit: false,
              updatedAt: isoNow(),
            }
          : x
      )
    );
  }

  function openDraftEditor(id: string) {
    // You can later create /dashboard/author/submissions/[id]/edit
    router.push(`/dashboard/author/submissions/${id}?mode=edit`);
  }

  function viewSubmission(id: string) {
    router.push(`/dashboard/author/submissions/${id}`);
  }

  function resubmitToEvent(item: AuthorSubmission) {
    // Suggested route: /event/[eventId]/submit?submissionId=...
    router.push(`/event/${item.eventId}/submit?submissionId=${encodeURIComponent(item.id)}`);
  }

  function goToNewSubmission() {
    // Where you list events with CFP open. Change if your route differs.
    router.push("/event");
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white flex items-center justify-center">
        <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
          Loading author workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/Asset 1.png" alt="Logo" className="h-9" />
            <div className="leading-tight">
              <div className="font-semibold tracking-wide">Author Workspace</div>
              <div className="text-xs text-white/70">Submissions</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
              <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center font-bold">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="font-semibold">{currentUser.name}</div>
                <div className="text-xs text-white/70">{currentUser.email}</div>
              </div>
              <span className="ml-2 px-2.5 py-1 text-xs rounded-full border bg-sky-500/15 text-sky-200 border-sky-400/25">
                {currentUser.role}
              </span>
            </div>

            <button
              onClick={() => alert("Hook logout to your auth later")}
              className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero-like header inside dashboard */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 opacity-15">
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm text-white/80">
                <IconBolt className="w-4 h-4" />
                Your research pipeline
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
                Manage your submissions{" "}
                <span className="text-white/70 font-semibold">
                  like a real conference platform.
                </span>
              </h1>

              <p className="mt-3 text-white/75 max-w-2xl">
                Track statuses, respond to revision requests, and navigate into details pages.
                This page is designed to feel real even without backend (DAW2).
              </p>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={goToNewSubmission}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
                >
                  <IconPlus className="w-5 h-5" />
                  New Submission
                </button>

                <Link
                  href="/dashboard/author/certificates"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition font-semibold"
                >
                  {/* simple certificate icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 012 2v16l-4-2-3 2-3-2-4 2V5a2 2 0 012-2z" />
                  </svg>
                  Certificates
                </Link>
              </div>
            </div>
          </div>

          {/* Stats panel */}
          <div className="p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="text-lg font-bold">Quick Stats</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniStat label="Active" value={counters.total} />
              <MiniStat label="Accepted" value={counters.accepted} />
              <MiniStat label="In review" value={counters.review} />
              <MiniStat label="Revision" value={counters.revision} />
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white/75">
              Drafts: <span className="font-semibold text-white">{counters.drafts}</span>
              <div className="mt-2 text-xs text-white/60">
                Drafts can be edited until submission.
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <IconSearch className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search title, event, track, keywords..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <IconFilter className="w-5 h-5 text-white/60 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="pl-11 pr-10 py-3 rounded-2xl bg-white/10 border border-white/15 outline-none"
                >
                  <option value="ALL">All statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under review</option>
                  <option value="REVISION">Revision</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 outline-none"
              >
                <option value="ALL">All events</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 outline-none"
              >
                <option value="ALL">All types</option>
                <option value="ORAL">Oral</option>
                <option value="POSTER">Poster</option>
                <option value="DISPLAY">Display</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/60">
            Tip: “Revision requested” items will show a <span className="text-white font-semibold">Resubmit</span> action.
            Drafts show <span className="text-white font-semibold">Edit</span>.
          </div>
        </div>

        {/* List */}
        <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-bold">My Submissions</div>
              <div className="text-sm text-white/70">
                Showing <span className="font-semibold text-white">{filtered.length}</span> result(s)
              </div>
            </div>

            <button
              onClick={goToNewSubmission}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600/70 hover:bg-blue-600 border border-blue-300/20 transition font-semibold"
            >
              <IconPlus className="w-5 h-5" />
              New
            </button>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-sm text-white/80">
                  <th className="p-4">Paper</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => {
                  const meta = statusMeta(it.status);
                  const typeMeta = typePill(it.type);

                  return (
                    <tr key={it.id} className="border-t border-white/10 hover:bg-white/[0.06] transition">
                      <td className="p-4">
                        <div className="font-semibold">{it.title}</div>
                        <div className="mt-1 text-xs text-white/60 flex flex-wrap gap-2">
                          {it.track && (
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              Track: {it.track}
                            </span>
                          )}
                          {it.keywords?.slice(0, 3).map((k) => (
                            <span key={k} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              {k}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 text-white/85">
                        <div className="font-semibold">{it.eventTitle}</div>
                        <div className="text-xs text-white/60">Event: {it.eventId}</div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs ${typeMeta.cls}`}>
                          {typeMeta.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs ${badgeClass(meta.tone)}`}>
                          {meta.label}
                        </span>
                      </td>

                      <td className="p-4 text-white/80">
                        <div>{formatDate(it.updatedAt)}</div>
                        {it.submittedAt && <div className="text-xs text-white/60">Submitted: {formatDate(it.submittedAt)}</div>}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <ActionIconButton title="View" onClick={() => viewSubmission(it.id)}>
                            <IconEye className="w-5 h-5" />
                          </ActionIconButton>

                          {it.canEdit && it.status === "DRAFT" && (
                            <ActionIconButton title="Edit Draft" onClick={() => openDraftEditor(it.id)}>
                              <IconEdit className="w-5 h-5" />
                            </ActionIconButton>
                          )}

                          {it.canResubmit && it.status === "REVISION" && (
                            <ActionPrimaryButton title="Resubmit" onClick={() => resubmitToEvent(it)}>
                              <IconUpload className="w-5 h-5" />
                              Resubmit
                            </ActionPrimaryButton>
                          )}

                          {it.status !== "WITHDRAWN" && it.status !== "ACCEPTED" && (
                            <ActionDangerButton title="Withdraw" onClick={() => withdraw(it.id)}>
                              <IconTrash className="w-5 h-5" />
                            </ActionDangerButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-white/70">
                      No submissions match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden p-4 space-y-3">
            {filtered.map((it) => {
              const meta = statusMeta(it.status);
              const typeMeta = typePill(it.type);

              return (
                <div key={it.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold">{it.title}</div>
                      <div className="text-sm text-white/70 mt-1">{it.eventTitle}</div>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full border text-xs ${badgeClass(meta.tone)}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full border text-xs ${typeMeta.cls}`}>{typeMeta.label}</span>
                    {it.track && (
                      <span className="px-3 py-1 rounded-full border text-xs bg-white/5 border-white/10 text-white/80">
                        {it.track}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-white/60">
                    Updated: {formatDate(it.updatedAt)}
                    {it.submittedAt ? ` • Submitted: ${formatDate(it.submittedAt)}` : ""}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => viewSubmission(it.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition font-semibold"
                    >
                      <IconEye className="w-5 h-5" />
                      View
                    </button>

                    {it.canResubmit && it.status === "REVISION" && (
                      <button
                        onClick={() => resubmitToEvent(it)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/70 hover:bg-blue-600 border border-blue-300/20 transition font-semibold"
                      >
                        <IconUpload className="w-5 h-5" />
                        Resubmit
                      </button>
                    )}

                    {it.canEdit && it.status === "DRAFT" && (
                      <button
                        onClick={() => openDraftEditor(it.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition font-semibold"
                      >
                        <IconEdit className="w-5 h-5" />
                        Edit
                      </button>
                    )}

                    {it.status !== "WITHDRAWN" && it.status !== "ACCEPTED" && (
                      <button
                        onClick={() => withdraw(it.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/60 hover:bg-rose-600 border border-rose-300/20 transition font-semibold"
                      >
                        <IconTrash className="w-5 h-5" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-10 text-center text-white/70 rounded-2xl bg-white/5 border border-white/10">
                No submissions match your filters.
              </div>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="text-xs text-white/60 px-2">
          Next pages to build later:{" "}
          <span className="text-white/80 font-semibold">
            /dashboard/author/submissions/[id]
          </span>{" "}
          (details) and{" "}
          <span className="text-white/80 font-semibold">/event/[eventId]/submit</span>{" "}
          (resubmission / new submission).
        </div>
      </div>
    </div>
  );
}

/* =========================
   UI Components
========================= */

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function ActionIconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
    >
      {children}
    </button>
  );
}

function ActionPrimaryButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-blue-600/80 hover:bg-blue-600 border border-blue-300/20 transition font-semibold"
    >
      {children}
    </button>
  );
}

function ActionDangerButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-rose-600/55 hover:bg-rose-600 border border-rose-300/20 transition"
    >
      {children}
    </button>
  );
}
