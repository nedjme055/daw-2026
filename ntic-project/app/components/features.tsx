"use client";

import React from "react";
import EventCard from "./EventCard";

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION INTRO */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Your Event Lives on the Platform
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            From the first announcement to final statistics, every step of your
            scientific event is handled in one coherent workflow.
          </p>
        </div>

        {/* FLOW */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* STEP 1 */}
          <FlowStep
            title="Create the Event"
            description="Define dates, location, themes and visibility in minutes."
            icon={
              <CalendarIcon />
            }
          />

          {/* STEP 2 */}
          <FlowStep
            title="Call for Papers"
            description="Collect abstracts, manage deadlines and communicate with authors."
            icon={
              <DocumentIcon />
            }
          />

          {/* STEP 3 */}
          <FlowStep
            title="Scientific Review"
            description="Assign submissions, evaluate quality and make decisions transparently."
            icon={
              <ReviewIcon />
            }
          />

          {/* STEP 4 */}
          <FlowStep
            title="Participants & Program"
            description="Registrations, sessions, speakers and workshops in one place."
            icon={
              <UsersIcon />
            }
          />

          {/* STEP 5 */}
          <FlowStep
            title="Statistics & Certificates"
            description="Generate reports, attendance stats and official attestations."
            icon={
              <StatsIcon />
            }
          />
        </div>

        {/* UPCOMING EVENTS */}
        <div
          id="upcoming-events"
          className="mt-32 scroll-mt-28"
        >
          <div className="mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Upcoming Events
            </h3>
            <p className="text-slate-400 max-w-2xl">
              Discover scientific events currently open for participation and submissions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <EventCard
              id="1"
              title="Medical AI Conference"
              description="Advances in artificial intelligence for healthcare."
              date="9 November"
              location="Constantine"
              participants="120"
              category={{ icon: "AI", label: "Conference" }}
            />

            <EventCard
              id="2"
              title="Public Health Workshop"
              description="Workshops on community health strategies."
              date="12 December"
              location="Algiers"
              participants="80"
              category={{ icon: "Health", label: "Workshop" }}
            />

            <EventCard
              id="3"
              title="Clinical Research Symposium"
              description="Sharing recent clinical research outcomes."
              date="5 January"
              location="Oran"
              participants="200"
              category={{ icon: "Research", label: "Symposium" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================= */
/* COMPONENTS */
/* ========================= */

function FlowStep({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group text-center relative">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ========================= */
/* ICONS */
/* ========================= */

function CalendarIcon() {
  return (
    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        d="M11 3v18M6 8v13M16 13v8M21 18v3" />
    </svg>
  );
}
