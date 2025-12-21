"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * DAW2: Roles in spec (super admin, organizer, author/communicant, committee member, participant, etc.)
 * We model them cleanly here so your UI matches the PDF requirements.
 */
type Role =
  | "SUPER_ADMIN"
  | "ORGANIZER"
  | "AUTHOR"
  | "COMMITTEE"
  | "PARTICIPANT"
  | "SPEAKER"
  | "WORKSHOP_HOST";

type EventStatus =
  | "DRAFT"
  | "CFP_OPEN"
  | "REVIEW"
  | "PUBLISHED"
  | "ONGOING"
  | "CLOSED";

type SubmissionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "REVISION";

type PaymentStatus = "UNPAID" | "PAID_ONSITE" | "PAID";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface EventItem {
  id: string;
  title: string;
  theme: string;
  location: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  status: EventStatus;
  participantsCount: number;
  submissionsCount: number;
  acceptanceRate?: number; // computed or provided
}

interface Submission {
  id: string;
  eventId: string;
  title: string;
  type: "ORAL" | "POSTER" | "DISPLAY";
  status: SubmissionStatus;
  authorName: string;
}

interface Registration {
  id: string;
  eventId: string;
  participantName: string;
  role: "PARTICIPANT" | "AUTHOR" | "SPEAKER";
  paymentStatus: PaymentStatus;
}

interface SessionItem {
  id: string;
  eventId: string;
  title: string;
  room: string;
  startsAt: string; // ISO datetime
  endsAt: string; // ISO datetime
  chairName: string;
}

interface WorkshopItem {
  id: string;
  eventId: string;
  title: string;
  hostName: string;
  date: string; // ISO date
  capacity: number;
  registered: number;
}

type DashboardTab =
  | "overview"
  | "events"
  | "submissions"
  | "evaluations"
  | "registrations"
  | "program"
  | "workshops"
  | "qa_surveys"
  | "attestations"
  | "stats"
  | "users";

function formatDate(iso: string) {
  // Simple formatting, no extra libs
  return new Date(iso).toLocaleDateString();
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString();
}

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

function eventStatusMeta(status: EventStatus) {
  switch (status) {
    case "DRAFT":
      return { label: "Draft", kind: "neutral" as const };
    case "CFP_OPEN":
      return { label: "CFP Open", kind: "info" as const };
    case "REVIEW":
      return { label: "Under Review", kind: "warning" as const };
    case "PUBLISHED":
      return { label: "Published", kind: "info" as const };
    case "ONGOING":
      return { label: "Ongoing", kind: "success" as const };
    case "CLOSED":
      return { label: "Closed", kind: "neutral" as const };
  }
}

function submissionStatusMeta(status: SubmissionStatus) {
  switch (status) {
    case "PENDING":
      return { label: "Pending", kind: "warning" as const };
    case "ACCEPTED":
      return { label: "Accepted", kind: "success" as const };
    case "REJECTED":
      return { label: "Rejected", kind: "danger" as const };
    case "REVISION":
      return { label: "Revision", kind: "info" as const };
  }
}

function paymentStatusMeta(status: PaymentStatus) {
  switch (status) {
    case "UNPAID":
      return { label: "Unpaid", kind: "warning" as const };
    case "PAID_ONSITE":
      return { label: "Pay on site", kind: "info" as const };
    case "PAID":
      return { label: "Paid", kind: "success" as const };
  }
}

function canSeeTab(role: Role, tab: DashboardTab) {
  // Professional approach: role-aware access (UI level). Backend must enforce too.
  const organizerTabs: DashboardTab[] = [
    "overview",
    "events",
    "submissions",
    "evaluations",
    "registrations",
    "program",
    "workshops",
    "qa_surveys",
    "attestations",
    "stats",
  ];

  const committeeTabs: DashboardTab[] = [
    "overview",
    "evaluations",
    "submissions",
  ];
  const authorTabs: DashboardTab[] = [
    "overview",
    "submissions",
    "attestations",
  ];
  const participantTabs: DashboardTab[] = [
    "overview",
    "registrations",
    "attestations",
  ];
  const superAdminTabs: DashboardTab[] = [...organizerTabs, "users"];

  if (role === "SUPER_ADMIN") return superAdminTabs.includes(tab);
  if (role === "ORGANIZER") return organizerTabs.includes(tab);
  if (role === "COMMITTEE") return committeeTabs.includes(tab);
  if (role === "AUTHOR") return authorTabs.includes(tab);
  if (role === "PARTICIPANT") return participantTabs.includes(tab);

  // Speaker / workshop host (minimal sample)
  return ["overview", "program"].includes(tab);
}

export default function DashboardPage() {
  const router = useRouter();

  // 🔒 Replace this with real auth later (context / session / token)
  const currentUser: CurrentUser = {
    id: "u1",
    name: "Admin Organizer",
    email: "admin@example.com",
    role: "ORGANIZER",
  };

  const [tab, setTab] = useState<DashboardTab>("overview");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // ✅ Mock data now, swap with API later
  const events = useMemo(() => {
    return [
      {
        id: "e1",
        title: "Vaccination Drive Week",
        theme: "Public Health",
        location: "Constantine",
        startDate: "2025-01-10",
        endDate: "2025-01-12",
        status: "CFP_OPEN",
        participantsCount: 120,
        submissionsCount: 34,
        acceptanceRate: 0.0,
      },
      {
        id: "e2",
        title: "Mental Health Awareness Seminar",
        theme: "Mental Health",
        location: "Oran",
        startDate: "2025-02-05",
        endDate: "2025-02-05",
        status: "ONGOING",
        participantsCount: 300,
        submissionsCount: 88,
        acceptanceRate: 0.42,
      },
      {
        id: "e3",
        title: "Cardiology Research Day",
        theme: "Cardiology",
        location: "Algiers",
        startDate: "2025-03-01",
        endDate: "2025-03-02",
        status: "REVIEW",
        participantsCount: 90,
        submissionsCount: 52,
        acceptanceRate: 0.25,
      },
    ] as const;
  }, []);

  const submissions = useMemo(() => {
    return [
      {
        id: "s1",
        eventId: "e1",
        title: "Vaccine uptake predictors",
        type: "ORAL",
        status: "PENDING",
        authorName: "A. Yahi",
      },
      {
        id: "s2",
        eventId: "e2",
        title: "Adolescent anxiety trends",
        type: "POSTER",
        status: "ACCEPTED",
        authorName: "S. Benali",
      },
      {
        id: "s3",
        eventId: "e3",
        title: "ECG arrhythmia detection",
        type: "DISPLAY",
        status: "REVISION",
        authorName: "M. Aouad",
      },
      {
        id: "s4",
        eventId: "e3",
        title: "Heart failure cohort study",
        type: "ORAL",
        status: "REJECTED",
        authorName: "N. Kaci",
      },
    ] as const;
  }, []);

  const registrations: Registration[] = [
    {
      id: "r1",
      eventId: "e1",
      participantName: "H. Ouali",
      role: "PARTICIPANT",
      paymentStatus: "UNPAID",
    },
    {
      id: "r2",
      eventId: "e2",
      participantName: "S. Benali",
      role: "AUTHOR",
      paymentStatus: "PAID",
    },
    {
      id: "r3",
      eventId: "e3",
      participantName: "Dr. A. Cherif",
      role: "SPEAKER",
      paymentStatus: "PAID_ONSITE",
    },
  ];

  const sessions = useMemo(() => {
    return [
      {
        id: "p1",
        eventId: "e2",
        title: "Opening Keynote",
        room: "Hall A",
        startsAt: "2025-02-05T09:00:00",
        endsAt: "2025-02-05T10:00:00",
        chairName: "Dr. M. Hakim",
      },
      {
        id: "p2",
        eventId: "e2",
        title: "Panel: Community Care",
        room: "Hall B",
        startsAt: "2025-02-05T10:30:00",
        endsAt: "2025-02-05T11:30:00",
        chairName: "Dr. R. Saidi",
      },
    ] as const;
  }, []);

  const workshops = useMemo(() => {
    return [
      {
        id: "w1",
        eventId: "e2",
        title: "CBT Basics Workshop",
        hostName: "Dr. L. Amara",
        date: "2025-02-05",
        capacity: 30,
        registered: 25,
      },
      {
        id: "w2",
        eventId: "e1",
        title: "Cold Chain Management",
        hostName: "H. Ouali",
        date: "2025-01-11",
        capacity: 20,
        registered: 20,
      },
    ] as const;
  }, []);

  const filteredEvents = useMemo(() => {
    const byStatus =
      eventFilter === "all"
        ? events
        : events.filter((e) => e.status === eventFilter);

    const q = search.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter((e) => {
      const text = `${e.title} ${e.theme} ${e.location}`.toLowerCase();
      return text.includes(q);
    });
  }, [events, eventFilter, search]);

  const overview = useMemo(() => {
    const totalEvents = events.length;
    const totalParticipants = events.reduce(
      (acc, e) => acc + e.participantsCount,
      0
    );
    const totalSubmissions = events.reduce(
      (acc, e) => acc + e.submissionsCount,
      0
    );
    const ongoing = events.filter((e) => e.status === "ONGOING").length;
    const cfpOpen = events.filter((e) => e.status === "CFP_OPEN").length;

    const accepted = submissions.filter((s) => s.status === "ACCEPTED").length;
    const pending = submissions.filter((s) => s.status === "PENDING").length;

    return {
      totalEvents,
      totalParticipants,
      totalSubmissions,
      ongoing,
      cfpOpen,
      accepted,
      pending,
    };
  }, [events, submissions]);

  const visibleTabs: { id: DashboardTab; label: string; hint: string }[] = [
    { id: "overview" as const, label: "Overview", hint: "Stats + activity" },
    { id: "events" as const, label: "Events", hint: "Create/configure events" },
    {
      id: "submissions" as const,
      label: "Submissions",
      hint: "CFP + tracking",
    },
    {
      id: "evaluations" as const,
      label: "Evaluations",
      hint: "Review & decisions",
    },
    {
      id: "registrations" as const,
      label: "Registrations",
      hint: "Participants & payments",
    },
    { id: "program" as const, label: "Program", hint: "Sessions & scheduling" },
    {
      id: "workshops" as const,
      label: "Workshops",
      hint: "Capacity + materials",
    },
    {
      id: "qa_surveys" as const,
      label: "Q&A / Surveys",
      hint: "Interaction & feedback",
    },
    {
      id: "attestations" as const,
      label: "Attestations",
      hint: "Generate certificates",
    },
    { id: "stats" as const, label: "Statistics", hint: "Reports & KPIs" },
    { id: "users" as const, label: "Users", hint: "Platform accounts" },
  ].filter((t) => canSeeTab(currentUser.role, t.id));

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 p-4 md:p-6 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/assets/Asset 1.png" alt="" className="h-10" />
            <span className="hidden sm:block font-semibold tracking-wide">
              Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border border-white/15">
              <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center font-bold">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="font-semibold">{currentUser.name}</div>
                <div className="text-xs text-white/70">{currentUser.email}</div>
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
              onClick={() => alert("Hook this to logout later")}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-[280px] hidden md:block p-6 border-r border-white/15">
          <div className="mb-6">
            <div className="text-sm text-white/70">Signed in as</div>
            <div className="font-semibold">{currentUser.name}</div>
            <div className="text-sm text-white/70">{currentUser.email}</div>
          </div>

          <nav className="space-y-2">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                  tab === t.id
                    ? "bg-blue-600/70 border-blue-300/20 shadow-lg"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                }`}
              >
                <div className="font-semibold">{t.label}</div>
                <div className="text-xs text-white/70">{t.hint}</div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}

        <main className="flex-1 p-4 md:p-8">
          {/* Mobile tabs */}
          <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
            {visibleTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full border whitespace-nowrap transition ${
                  tab === t.id
                    ? "bg-blue-600/70 border-blue-300/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Overview</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Events" value={overview.totalEvents} />
                <StatCard
                  title="Participants"
                  value={overview.totalParticipants}
                />
                <StatCard
                  title="Submissions"
                  value={overview.totalSubmissions}
                />
                <StatCard title="Ongoing" value={overview.ongoing} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Panel title="Submission Pipeline">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80">Accepted</div>
                    <span
                      className={`px-3 py-1 rounded-full border ${badgeClass(
                        "success"
                      )}`}
                    >
                      {overview.accepted}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-white/80">Pending</div>
                    <span
                      className={`px-3 py-1 rounded-full border ${badgeClass(
                        "warning"
                      )}`}
                    >
                      {overview.pending}
                    </span>
                  </div>
                </Panel>

                <Panel title="Quick Actions">
                  <div className="flex flex-wrap gap-3">
                    {currentUser.role === "ORGANIZER" && (
                      <ActionButton
                        onClick={() => router.push("/dashboard/events/create")}
                      >
                        + Create Event
                      </ActionButton>
                    )}
                    <ActionButton onClick={() => setTab("events")}>
                      Manage Events
                    </ActionButton>
                    <ActionButton onClick={() => setTab("registrations")}>
                      View Registrations
                    </ActionButton>
                    <ActionButton onClick={() => setTab("stats")}>
                      Generate Stats
                    </ActionButton>
                  </div>
                  <p className="mt-3 text-sm text-white/70">
                    This dashboard is aligned with DAW2 modules: event
                    management, CFP/submissions, evaluations, registrations,
                    program sessions, workshops, Q&A/surveys, attestations,
                    statistics.
                  </p>
                </Panel>
              </div>
            </div>
          )}

          {/* Events */}
          {tab === "events" && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-bold">Events</h2>
                  <p className="text-white/70">
                    Create, configure and manage scientific events.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, theme, location..."
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 outline-none focus:ring-2 focus:ring-blue-400/40"
                  />

                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 outline-none"
                  >
                    <option value="all">All statuses</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CFP_OPEN">CFP Open</option>
                    <option value="REVIEW">Review</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="CLOSED">Closed</option>
                  </select>

                  {currentUser.role === "ORGANIZER" && (
                    <button
                      onClick={() => router.push("/dashboard/events/create")}
                      className="px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 transition border border-blue-300/20 font-semibold"
                    >
                      + New Event
                    </button>
                  )}
                </div>
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredEvents.map((ev) => {
                  const meta = eventStatusMeta(ev.status);

                  return (
                    <div
                      key={ev.id}
                      className="p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md"
                    >
                      {/* Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xl font-bold">{ev.title}</div>
                          <div className="text-sm text-white/70">
                            {ev.theme} • {ev.location}
                          </div>
                          <div className="text-sm text-white/70 mt-1">
                            {formatDate(ev.startDate)} →{" "}
                            {formatDate(ev.endDate)}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-sm border ${badgeClass(
                            meta.kind
                          )}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <MiniStat
                          label="Participants"
                          value={ev.participantsCount}
                        />
                        <MiniStat
                          label="Submissions"
                          value={ev.submissionsCount}
                        />
                        <MiniStat
                          label="Acceptance"
                          value={
                            ev.acceptanceRate != null
                              ? `${Math.round(ev.acceptanceRate * 100)}%`
                              : "—"
                          }
                        />
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            router.push(`/event/${ev.id}`)
                          }
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
                        >
                          Details
                        </button>

                        {currentUser.role === "ORGANIZER" && (
                          <>
                            <button
                              onClick={() =>
                                router.push(`/dashboard/events/${ev.id}/edit`)
                              }
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${ev.title}"?`
                                  )
                                ) {
                                  alert(
                                    "Delete logic goes here (API call later)"
                                  );
                                }
                              }}
                              className="px-3 py-2 rounded-xl bg-red-600/70 hover:bg-red-600 border border-red-300/20 transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submissions */}
          {tab === "submissions" && (
            <SectionTable
              title="Submissions"
              subtitle="Track CFP submissions and their status (pending/accepted/rejected/revision)."
              columns={["Title", "Author", "Type", "Status", "Event"]}
            >
              {submissions.map((s) => {
                const meta = submissionStatusMeta(s.status);
                const ev = events.find((e) => e.id === s.eventId);
                return (
                  <tr
                    key={s.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-semibold">{s.title}</td>
                    <td className="p-4 text-white/80">{s.authorName}</td>
                    <td className="p-4 text-white/80">{s.type}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${badgeClass(
                          meta.kind
                        )}`}
                      >
                        {meta.label}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{ev?.title ?? "—"}</td>
                  </tr>
                );
              })}
            </SectionTable>
          )}

          {/* Evaluations (placeholder but aligned) */}
          {tab === "evaluations" && (
            <Panel title="Evaluations">
              <p className="text-white/80">
                This is where committee members evaluate submissions (scores +
                comments + decision), as required.
              </p>
              <ul className="mt-3 list-disc ml-5 text-white/70 space-y-1">
                <li>Assign submissions to evaluators (manual/auto)</li>
                <li>
                  Evaluation form: relevance, scientific quality, originality
                </li>
                <li>Decision: accept / reject / revision</li>
              </ul>
              <div className="mt-4">
                <ActionButton
                  onClick={() =>
                    alert("Implement /dashboard/evaluations later")
                  }
                >
                  Go to Evaluation Interface
                </ActionButton>
              </div>
            </Panel>
          )}

          {/* Registrations */}
          {tab === "registrations" && (
            <SectionTable
              title="Registrations"
              subtitle="Manage participant registrations and payment status."
              columns={["Name", "Role", "Payment", "Event", "Actions"]}
            >
              {registrations.map((r) => {
                const meta = paymentStatusMeta(r.paymentStatus);
                const ev = events.find((e) => e.id === r.eventId);
                return (
                  <tr
                    key={r.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-semibold">{r.participantName}</td>
                    <td className="p-4 text-white/80">{r.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${badgeClass(
                          meta.kind
                        )}`}
                      >
                        {meta.label}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{ev?.title ?? "—"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition"
                          onClick={() => alert(`View registration: ${r.id}`)}
                        >
                          View
                        </button>
                        {currentUser.role === "ORGANIZER" && (
                          <button
                            className="px-3 py-2 rounded-xl bg-blue-600/70 hover:bg-blue-600 border border-blue-300/20 transition"
                            onClick={() => alert(`Mark paid: ${r.id}`)}
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </SectionTable>
          )}

          {/* Program */}
          {tab === "program" && (
            <SectionTable
              title="Program"
              subtitle="Sessions scheduling (title, time, room, chair)."
              columns={["Session", "Room", "Time", "Chair", "Event"]}
            >
              {sessions.map((s) => {
                const ev = events.find((e) => e.id === s.eventId);
                return (
                  <tr
                    key={s.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-semibold">{s.title}</td>
                    <td className="p-4 text-white/80">{s.room}</td>
                    <td className="p-4 text-white/80">
                      {formatDateTime(s.startsAt)} → {formatDateTime(s.endsAt)}
                    </td>
                    <td className="p-4 text-white/80">{s.chairName}</td>
                    <td className="p-4 text-white/80">{ev?.title ?? "—"}</td>
                  </tr>
                );
              })}
            </SectionTable>
          )}

          {/* Workshops */}
          {tab === "workshops" && (
            <SectionTable
              title="Workshops"
              subtitle="Workshops module: capacity, registrations, materials."
              columns={["Title", "Host", "Date", "Capacity", "Event"]}
            >
              {workshops.map((w) => {
                const ev = events.find((e) => e.id === w.eventId);
                const full = w.registered >= w.capacity;
                return (
                  <tr
                    key={w.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-semibold">{w.title}</td>
                    <td className="p-4 text-white/80">{w.hostName}</td>
                    <td className="p-4 text-white/80">{formatDate(w.date)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${badgeClass(
                          full ? "warning" : "success"
                        )}`}
                      >
                        {w.registered}/{w.capacity}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">{ev?.title ?? "—"}</td>
                  </tr>
                );
              })}
            </SectionTable>
          )}

          {/* Q&A / Surveys */}
          {tab === "qa_surveys" && (
            <Panel title="Q&A / Surveys">
              <p className="text-white/80">
                During the event you need interactive questions + voting, plus
                post-session surveys.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton
                  onClick={() => alert("Implement live Q&A page later")}
                >
                  Open Live Q&A
                </ActionButton>
                <ActionButton
                  onClick={() => alert("Implement surveys builder later")}
                >
                  Create Survey
                </ActionButton>
              </div>
            </Panel>
          )}

          {/* Attestations */}
          {tab === "attestations" && (
            <Panel title="Attestations">
              <p className="text-white/80">
                After the event: generate PDF certificates for
                participants/organizers/committee/authors.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton
                  onClick={() => alert("Generate PDF later via backend")}
                >
                  Generate Certificates
                </ActionButton>
                <ActionButton
                  onClick={() => alert("Download certificates list")}
                >
                  Download List
                </ActionButton>
              </div>
            </Panel>
          )}

          {/* Stats */}
          {tab === "stats" && (
            <Panel title="Statistics">
              <p className="text-white/80">
                Required: automatic stats (submissions, acceptance rate,
                distribution, participation, etc.).
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniStat label="Events" value={overview.totalEvents} />
                <MiniStat
                  label="Submissions"
                  value={overview.totalSubmissions}
                />
                <MiniStat
                  label="Participants"
                  value={overview.totalParticipants}
                />
              </div>
            </Panel>
          )}

          {/* Users (only super admin) */}
          {tab === "users" && (
            <Panel title="Users">
              <p className="text-white/80">
                Super admin manages organizer accounts + platform supervision.
              </p>
              <p className="text-white/70 mt-2">
                Hook this to your users API later.
              </p>
            </Panel>
          )}
        </main>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
      <div className="text-white/70 text-sm">{title}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <div className="text-xs text-white/70">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-blue-600/70 hover:bg-blue-600 border border-blue-300/20 transition font-semibold"
    >
      {children}
    </button>
  );
}

function SectionTable({
  title,
  subtitle,
  columns,
  children,
}: {
  title: string;
  subtitle?: string;
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-white/70 mt-1">{subtitle}</p>}
      </div>

      <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="p-4 text-left text-sm font-semibold text-white/80"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
