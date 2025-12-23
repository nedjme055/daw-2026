"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";

/* =========================
   Types
========================= */

type SubmissionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "REVISION";

interface SubmissionDetails {
  id: string;
  title: string;
  abstract: string;
  eventTitle: string;
  submittedAt: string;
  type: "ORAL" | "POSTER";
  status: SubmissionStatus;
  reviewerNotes?: string;
}

/* =========================
   Helpers
========================= */

function statusBadge(status: SubmissionStatus) {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-500/15 text-green-300 border-green-400/30";
    case "REJECTED":
      return "bg-red-500/15 text-red-300 border-red-400/30";
    case "REVISION":
      return "bg-blue-500/15 text-blue-300 border-blue-400/30";
    default:
      return "bg-yellow-500/15 text-yellow-300 border-yellow-400/30";
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}

/* =========================
   Page
========================= */

export default function SubmissionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  /**
   * MOCK DATA
   * Replace later with API call using `id`
   */
  const submission: SubmissionDetails = {
    id: String(id),
    title: "ECG Signal Classification Using AI",
    abstract:
      "This paper presents a deep learning approach for automatic ECG signal classification. The proposed model improves accuracy in arrhythmia detection and reduces false positives compared to traditional methods.",
    eventTitle: "Cardiology Research Day 2025",
    submittedAt: "2025-01-12",
    type: "ORAL",
    status: "REVISION",
    reviewerNotes:
      "The topic is relevant and well-structured. However, the methodology section requires more detail, and evaluation metrics must be clarified.",
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <span className="text-sm text-white/70">
            Submission ID: {submission.id}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{submission.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-white/70">
            <span>{submission.eventTitle}</span>
            <span>•</span>
            <span>Submitted on {formatDate(submission.submittedAt)}</span>
            <span>•</span>
            <span>{submission.type}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs border ${statusBadge(
              submission.status
            )}`}
          >
            {submission.status}
          </span>
        </div>

        {/* Abstract */}
        <section className="p-6 rounded-2xl bg-white/10 border border-white/15">
          <h2 className="text-xl font-bold mb-3">Abstract</h2>
          <p className="text-white/80 leading-relaxed">
            {submission.abstract}
          </p>
        </section>

        {/* Reviewer Notes */}
        {submission.reviewerNotes && (
          <section className="p-6 rounded-2xl bg-blue-500/10 border border-blue-400/30">
            <h2 className="text-xl font-bold mb-3">Reviewer Comments</h2>
            <p className="text-white/80 leading-relaxed">
              {submission.reviewerNotes}
            </p>
          </section>
        )}

        {/* Actions */}
        <section className="flex flex-wrap gap-3">
          {submission.status === "REVISION" && (
            <button
              onClick={() => router.push(`/event/ev-3/submit?revision=${id}`)}
              className="px-6 py-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 transition font-semibold border border-blue-300/30"
            >
              Resubmit Revised Paper
            </button>
          )}

          {submission.status === "ACCEPTED" && (
            <button
              onClick={() => alert("Download certificate later")}
              className="px-6 py-3 rounded-xl bg-green-600/80 hover:bg-green-600 transition font-semibold border border-green-300/30"
            >
              Download Certificate
            </button>
          )}

          <button
            onClick={() => alert("Download PDF later")}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/15"
          >
            Download Submission PDF
          </button>
        </section>
      </main>
    </div>
  );
}
