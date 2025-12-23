"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  BadgeCheck,
  FileText,
  GraduationCap,
  UserRound,
  Mail,
  Clock,
  CreditCard,
  Landmark,
  WalletCards,
  X,
  ChevronRight,
  Info,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/**
 * ✅ Single-file, copy-paste Event Details page
 * ✅ Keeps your logic: tabs + register modal (multi-step) + submit modal
 * ✅ Improves design: calmer, consistent, premium academic feel
 * ✅ No emojis, uses lucide-react icons (SVG)
 * ✅ Mobile friendly
 */

/* -------------------- Types -------------------- */
interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar: string; // initials
}

interface ProgramSession {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  type: "keynote" | "panel" | "workshop" | "break";
}

interface Organizer {
  id: string;
  name: string;
  role: string;
  email: string;
}

type TabKey = "overview" | "program" | "speakers";
type TicketType = "student" | "regular";
type RegistrationStep = "form" | "payment" | "success";
type PaymentMethod = "CARD" | "TRANSFER" | "ONSITE";

/* -------------------- Helpers -------------------- */
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatCapacity(current: number, max: number) {
  const pct = Math.min(100, Math.round((current / Math.max(1, max)) * 100));
  return { pct, label: `${current}/${max}` };
}

function sessionTypeLabel(type: ProgramSession["type"]) {
  switch (type) {
    case "keynote":
      return "Keynote";
    case "panel":
      return "Panel";
    case "workshop":
      return "Workshop";
    case "break":
      return "Break";
  }
}

function sessionTypePill(type: ProgramSession["type"]) {
  // Calmer, consistent palette
  switch (type) {
    case "keynote":
      return "bg-indigo-500/10 text-indigo-200 border-indigo-400/20";
    case "panel":
      return "bg-blue-500/10 text-blue-200 border-blue-400/20";
    case "workshop":
      return "bg-emerald-500/10 text-emerald-200 border-emerald-400/20";
    case "break":
      return "bg-slate-500/10 text-slate-200 border-slate-400/20";
  }
}

/* -------------------- UI Atoms -------------------- */
function IconBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-sm font-semibold text-white/90">{value}</div>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
  iconRight,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconRight?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition",
        "bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.99]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
      {iconRight}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  className,
  iconRight,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  iconRight?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition",
        "bg-blue-500/10 text-white border border-white/15 hover:bg-blue-500/15 active:scale-[0.99]",
        className
      )}
    >
      {children}
      {iconRight}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        "bg-white/5 hover:bg-white/10 border border-white/10",
        className
      )}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl bg-white/8 border border-white/12 backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          {icon ? (
            <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              {icon}
            </div>
          ) : null}
          <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
        </div>
        {subtitle ? (
          <p className="mt-2 text-white/70 max-w-3xl">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------- Modal Shell -------------------- */
function Modal({
  title,
  subtitle,
  children,
  onClose,
  footer,
  wide,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cx(
          "relative w-full rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-xl shadow-2xl",
          wide ? "max-w-2xl" : "max-w-md"
        )}
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-white/65">{subtitle}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
            aria-label="Close"
            type="button"
          >
            <X className="h-5 w-5 text-white/80" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="px-6 pb-6 pt-0">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------- Main Page -------------------- */
const EventDetailsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") ?? "1";

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("form");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [ticketType, setTicketType] = useState<TicketType>("regular");

  // Keep your “status” state if you want to connect to backend later
  const [registrationStatus] = useState<"registered" | "confirmed">("registered");
  const [submissionStatus] = useState<"submitted" | "under-review" | "accepted">(
    "under-review"
  );

  // Mock event data (replace with API by id later)
  const event = useMemo(() => {
    return {
      id,
      title: "International AI & Machine Learning Conference 2025",
      shortDescription:
        "A high-impact scientific conference on Artificial Intelligence and Machine Learning.",
      fullDescription:
        "Join researchers, practitioners, and industry leaders for a three-day scientific event. Explore deep learning, natural language processing, computer vision, reinforcement learning, and ethical considerations. The program includes keynote talks, panel sessions, workshops, and networking.",
      date: "March 15–17, 2025",
      startDate: "2025-03-15",
      endDate: "2025-03-17",
      location: "Paris Convention Center, Paris, France",
      category: "AI & Technology",
      participants: 450,
      maxCapacity: 500,
      registrationDeadline: "March 1, 2025",
      cfpOpen: true,
      cfpDeadline: "February 15, 2025",
      gradient: "from-blue-600 to-indigo-700",
      topics: [
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Reinforcement Learning",
        "AI Ethics",
        "ML Applications",
      ],
      organizers: [
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          role: "Conference Chair",
          email: "sarah.j@conference.org",
        },
        {
          id: "2",
          name: "Prof. Michael Chen",
          role: "Program Committee Chair",
          email: "michael.c@conference.org",
        },
        {
          id: "3",
          name: "Dr. Emma Williams",
          role: "Local Arrangements",
          email: "emma.w@conference.org",
        },
      ] as Organizer[],
      speakers: [
        {
          id: "1",
          name: "Dr. Alex Thompson",
          title: "Keynote Speaker",
          organization: "MIT AI Lab",
          avatar: "AT",
        },
        {
          id: "2",
          name: "Prof. Maria Garcia",
          title: "Panel Moderator",
          organization: "Stanford University",
          avatar: "MG",
        },
        {
          id: "3",
          name: "Dr. James Liu",
          title: "Workshop Leader",
          organization: "Google AI",
          avatar: "JL",
        },
        {
          id: "4",
          name: "Dr. Sofia Martinez",
          title: "Invited Speaker",
          organization: "DeepMind",
          avatar: "SM",
        },
      ] as Speaker[],
      program: [
        {
          id: "1",
          time: "09:00 - 09:30",
          title: "Registration & Welcome Coffee",
          type: "break" as const,
        },
        {
          id: "2",
          time: "09:30 - 10:30",
          title: "Opening Keynote: The Future of AI",
          speaker: "Dr. Alex Thompson",
          type: "keynote" as const,
        },
        {
          id: "3",
          time: "10:45 - 12:00",
          title: "Panel: Ethics in AI Development",
          speaker: "Prof. Maria Garcia",
          type: "panel" as const,
        },
        {
          id: "4",
          time: "12:00 - 13:30",
          title: "Lunch Break",
          type: "break" as const,
        },
        {
          id: "5",
          time: "13:30 - 15:00",
          title: "Workshop: Building Neural Networks",
          speaker: "Dr. James Liu",
          type: "workshop" as const,
        },
        {
          id: "6",
          time: "15:15 - 16:45",
          title: "Research Presentations Track A",
          type: "panel" as const,
        },
        {
          id: "7",
          time: "17:00 - 18:00",
          title: "Networking Reception",
          type: "break" as const,
        },
      ] as ProgramSession[],
    };
  }, [id]);

  const capacity = useMemo(
    () => formatCapacity(event.participants, event.maxCapacity),
    [event.participants, event.maxCapacity]
  );

  const handleRegister = () => {
    setRegistrationStep("form");
    setPaymentMethod(null);
    setShowRegisterModal(true);
  };

  const handleSubmitCommunication = () => {
    setShowSubmitModal(true);
  };

  const tabs: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
    { key: "overview", label: "Overview", icon: <Info className="h-4 w-4" /> },
    { key: "program", label: "Program", icon: <Clock className="h-4 w-4" /> },
    { key: "speakers", label: "Speakers", icon: <UserRound className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen text-white bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]">
      {/* Top strip */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to events
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" />
            Academic event page (public)
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        {/* Soft overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.25),transparent_55%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 relative z-10">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Left main */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white/10 border border-white/15 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-white/85" />
                <span className="text-sm font-semibold text-white/90">
                  {event.category}
                </span>
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight">
                {event.title}
              </h1>

              <p className="mt-4 text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed">
                {event.shortDescription}
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <IconBadge
                  icon={<Calendar className="h-5 w-5 text-white/80" />}
                  label="Dates"
                  value={event.date}
                />
                <IconBadge
                  icon={<MapPin className="h-5 w-5 text-white/80" />}
                  label="Location"
                  value={event.location}
                />
                <IconBadge
                  icon={<Users className="h-5 w-5 text-white/80" />}
                  label="Registration"
                  value={`${capacity.label} (${capacity.pct}%)`}
                />
                <IconBadge
                  icon={<BadgeCheck className="h-5 w-5 text-white/80" />}
                  label="Status"
                  value={
                    event.cfpOpen ? "CFP Open (Authors can submit)" : "CFP Closed"
                  }
                />
              </div>

              {/* Capacity bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Capacity</span>
                  <span className="font-semibold text-white/85">
                    {capacity.pct}%
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10 border border-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white/70"
                    style={{ width: `${capacity.pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action card */}
            <Card className="p-6 h-fit">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-extrabold">Join this event</h3>
                  <p className="mt-1 text-sm text-white/70">
                    Choose participant registration or submit a communication.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-white/75">
                  <span>Registration deadline</span>
                  <span className="font-semibold text-white/90">
                    {event.registrationDeadline}
                  </span>
                </div>
                {event.cfpOpen ? (
                  <div className="flex items-center justify-between text-white/75">
                    <span>CFP deadline</span>
                    <span className="font-semibold text-white/90">
                      {event.cfpDeadline}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                <PrimaryButton onClick={handleRegister} iconRight={<ChevronRight className="h-4 w-4" />}>
                  Register as participant
                </PrimaryButton>

                {event.cfpOpen ? (
                  <SecondaryButton
                    onClick={handleSubmitCommunication}
                    iconRight={<FileText className="h-4 w-4" />}
                  >
                    Submit communication
                  </SecondaryButton>
                ) : (
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white/70">
                    CFP is currently closed.
                  </div>
                )}
              </div>

              {/* Small hints */}
              <div className="mt-5 grid grid-cols-1 gap-2">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/70">
                  <span className="font-semibold text-white/85">Note:</span>{" "}
                  Payment is simulated (DAW2 demo). Backend can enforce rules later.
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/70">
                  <span className="font-semibold text-white/85">Status:</span>{" "}
                  Registration is{" "}
                  <span className="text-white/90 font-semibold">
                    {registrationStatus}
                  </span>{" "}
                  • Submission is{" "}
                  <span className="text-white/90 font-semibold">
                    {submissionStatus}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-[64px] z-40 border-y border-white/12 bg-white/8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-3">
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  type="button"
                  className={cx(
                    "shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition",
                    active
                      ? "bg-white/15 border-white/20 text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="p-6 lg:col-span-2">
              <SectionTitle
                title="About this event"
                subtitle="Scientific description, objectives, and main topics."
                icon={<Info className="h-5 w-5 text-white/85" />}
              />

              <p className="mt-5 text-white/80 leading-relaxed text-base md:text-lg">
                {event.fullDescription}
              </p>

              <div className="mt-8">
                <h3 className="text-lg font-extrabold">Key topics</h3>
                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {event.topics.map((topic) => (
                    <div
                      key={topic}
                      className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center gap-3"
                    >
                      <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white/80" />
                      </div>
                      <div className="font-semibold text-white/85">{topic}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 h-fit">
              <SectionTitle
                title="Organizers"
                subtitle="Official contacts for this scientific event."
                icon={<UserRound className="h-5 w-5 text-white/85" />}
              />
              <div className="mt-5 space-y-4">
                {event.organizers.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl bg-white/5 border border-white/10 p-4"
                  >
                    <div className="font-extrabold text-white/90">{o.name}</div>
                    <div className="text-sm text-blue-200/90 font-semibold mt-1">
                      {o.role}
                    </div>
                    <a
                      href={`mailto:${o.email}`}
                      className="mt-2 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
                    >
                      <Mail className="h-4 w-4" />
                      {o.email}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "program" && (
          <div>
            <SectionTitle
              title="Conference program"
              subtitle="Schedule overview. Organizers can later manage sessions in dashboard."
              icon={<Clock className="h-5 w-5 text-white/85" />}
            />

            <div className="mt-6 grid gap-3">
              {event.program.map((s) => (
                <Card key={s.id} className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="min-w-[92px]">
                        <div className="text-xs text-white/60">Time</div>
                        <div className="font-mono font-semibold text-white/90">
                          {s.time}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cx(
                              "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                              sessionTypePill(s.type)
                            )}
                          >
                            {sessionTypeLabel(s.type)}
                          </span>
                          {s.speaker ? (
                            <span className="text-xs text-white/60">
                              Speaker:{" "}
                              <span className="text-white/85 font-semibold">
                                {s.speaker}
                              </span>
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 text-lg font-extrabold text-white/92">
                          {s.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <GhostButton onClick={() => alert("Later: session details")}>
                        Details <ChevronRight className="h-4 w-4" />
                      </GhostButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "speakers" && (
          <div>
            <SectionTitle
              title="Featured speakers"
              subtitle="Profiles can be expanded later (bio, socials, talk title)."
              icon={<UserRound className="h-5 w-5 text-white/85" />}
            />

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {event.speakers.map((sp) => (
                <Card
                  key={sp.id}
                  className="p-6 hover:bg-white/10 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center font-extrabold">
                      {sp.avatar}
                    </div>

                    <div className="flex-1">
                      <div className="text-xl font-extrabold">{sp.name}</div>
                      <div className="mt-1 text-sm text-blue-200/90 font-semibold">
                        {sp.title}
                      </div>
                      <div className="mt-1 text-sm text-white/65">
                        {sp.organization}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <GhostButton onClick={() => alert("Later: speaker page")}>
                          View profile <ChevronRight className="h-4 w-4" />
                        </GhostButton>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Register Modal */}
      {showRegisterModal && (
        <Modal
          title="Register for this event"
          subtitle="Complete your registration in two steps: form → payment."
          onClose={() => {
            setShowRegisterModal(false);
            setRegistrationStep("form");
            setPaymentMethod(null);
          }}
          footer={
            registrationStep === "form" ? (
              <div className="flex gap-3">
                <SecondaryButton
                  onClick={() => {
                    setShowRegisterModal(false);
                    setRegistrationStep("form");
                    setPaymentMethod(null);
                  }}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton
                  onClick={() => setRegistrationStep("payment")}
                  iconRight={<ChevronRight className="h-4 w-4" />}
                >
                  Continue
                </PrimaryButton>
              </div>
            ) : registrationStep === "payment" ? (
              <div className="flex gap-3">
                <SecondaryButton
                  onClick={() => {
                    setRegistrationStep("form");
                    setPaymentMethod(null);
                  }}
                >
                  Back
                </SecondaryButton>
                <PrimaryButton
                  disabled={!paymentMethod}
                  onClick={() => setRegistrationStep("success")}
                  iconRight={<BadgeCheck className="h-4 w-4" />}
                >
                  Confirm
                </PrimaryButton>
              </div>
            ) : (
              <div className="flex gap-3">
                <PrimaryButton
                  onClick={() => {
                    setShowRegisterModal(false);
                    setRegistrationStep("form");
                    setPaymentMethod(null);
                  }}
                >
                  Close
                </PrimaryButton>
              </div>
            )
          }
        >
          {registrationStep === "form" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Full name" placeholder="Your full name" />
                <Input label="Email" placeholder="name@example.com" type="email" />
              </div>
              <Input label="Organization" placeholder="University / Hospital / Lab" />
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Phone" placeholder="+213 ..." />
                <Input label="Country" placeholder="Algeria" />
              </div>

              <div className="mt-2">
                <div className="text-sm font-extrabold mb-2">Ticket type</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <SelectableCard
                    active={ticketType === "regular"}
                    title="Regular"
                    subtitle="1500 DA"
                    icon={<UserRound className="h-5 w-5 text-white/85" />}
                    onClick={() => setTicketType("regular")}
                  />
                  <SelectableCard
                    active={ticketType === "student"}
                    title="Student"
                    subtitle="800 DA"
                    icon={<GraduationCap className="h-5 w-5 text-white/85" />}
                    onClick={() => setTicketType("student")}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/70">
                Your information is used only for registration purposes (demo text).
              </div>
            </div>
          )}

          {registrationStep === "payment" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Selected ticket</span>
                  <span className="font-semibold text-white/90">
                    {ticketType === "regular" ? "Regular (1500 DA)" : "Student (800 DA)"}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm font-extrabold mb-2">Payment method</div>
                <div className="grid gap-3">
                  <PaymentChoice
                    active={paymentMethod === "CARD"}
                    title="Card payment"
                    subtitle="Demo - simulate payment"
                    icon={<CreditCard className="h-5 w-5 text-white/85" />}
                    onClick={() => setPaymentMethod("CARD")}
                  />
                  <PaymentChoice
                    active={paymentMethod === "TRANSFER"}
                    title="Bank transfer"
                    subtitle="Demo - upload receipt later"
                    icon={<Landmark className="h-5 w-5 text-white/85" />}
                    onClick={() => setPaymentMethod("TRANSFER")}
                  />
                  <PaymentChoice
                    active={paymentMethod === "ONSITE"}
                    title="Pay on site"
                    subtitle="Pay at registration desk"
                    icon={<WalletCards className="h-5 w-5 text-white/85" />}
                    onClick={() => setPaymentMethod("ONSITE")}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/70">
                In a real system, the backend confirms payment status and generates an invoice/receipt.
              </div>
            </div>
          )}

          {registrationStep === "success" && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-emerald-100">
                      Registration complete
                    </div>
                    <div className="text-sm text-emerald-200/80">
                      You are registered for this event.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/75">
                Next steps: you can view your registration in your profile (later),
                and download your badge/attestation after attendance (later).
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <Modal
          title="Submit a communication"
          subtitle={`Deadline: ${event.cfpDeadline}`}
          onClose={() => setShowSubmitModal(false)}
          footer={
            <div className="flex gap-3">
              <SecondaryButton onClick={() => setShowSubmitModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  alert("Later: submit to API");
                  setShowSubmitModal(false);
                }}
                iconRight={<FileText className="h-4 w-4" />}
              >
                Submit
              </PrimaryButton>
            </div>
          }
          wide
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input label="Paper title" placeholder="Your paper title" />
            </div>
            <div className="md:col-span-2">
              <TextArea
                label="Abstract"
                placeholder="Write your abstract (max 300 words)"
                rows={6}
              />
            </div>
            <div className="md:col-span-2">
              <Input label="Keywords" placeholder="AI, ML, NLP, ..." />
            </div>

            <div className="md:col-span-2 rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white/70">
              Tip: In DAW2 you can explain that the organizer later assigns submissions to committee members and records decisions.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EventDetailsPage;

/* -------------------- Inputs -------------------- */
function Input({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs text-white/70 font-semibold mb-2">{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition"
      />
    </label>
  );
}

function TextArea({
  label,
  placeholder,
  rows = 5,
}: {
  label: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="text-xs text-white/70 font-semibold mb-2">{label}</div>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition resize-none"
      />
    </label>
  );
}

/* -------------------- Select Cards -------------------- */
function SelectableCard({
  active,
  title,
  subtitle,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "text-left rounded-2xl p-4 border transition w-full",
        active
          ? "bg-white/12 border-white/25"
          : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-white/90">{title}</div>
          <div className="text-sm text-white/65">{subtitle}</div>
        </div>
        {active ? (
          <BadgeCheck className="h-5 w-5 text-white/80" />
        ) : null}
      </div>
    </button>
  );
}

function PaymentChoice({
  active,
  title,
  subtitle,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "text-left rounded-2xl p-4 border transition w-full",
        active
          ? "bg-white/12 border-white/25"
          : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-white/90">{title}</div>
          <div className="text-sm text-white/65">{subtitle}</div>
        </div>
        {active ? (
          <BadgeCheck className="h-5 w-5 text-white/80" />
        ) : null}
      </div>
    </button>
  );
}
