"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

/* =========================
   Types
========================= */

type PaperType = "ORAL" | "POSTER";

/* =========================
   Page
========================= */

export default function SubmitPaperPage() {
  const { id: eventId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // if revision exists → resubmission mode
  const revisionId = searchParams.get("revision");

  /* =========================
     Form State
  ========================= */

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [type, setType] = useState<PaperType>("ORAL");
  const [file, setFile] = useState<File | null>(null);

  const isRevision = Boolean(revisionId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !abstract || !file) {
      alert("Please complete all required fields.");
      return;
    }

    // 🔧 Mock submit logic
    console.log({
      eventId,
      revisionId,
      title,
      abstract,
      keywords,
      type,
      fileName: file.name,
    });

    alert(
      isRevision
        ? "Revision submitted successfully!"
        : "Submission sent successfully!"
    );

    // redirect back to author dashboard
    router.push("/dashboard/author/submissions");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-md border-b border-white/15">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <span className="text-sm text-white/70">
            Event ID: {eventId}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isRevision ? "Resubmit Paper" : "Submit New Paper"}
          </h1>
          <p className="text-white/70 mt-1">
            {isRevision
              ? "Please upload the revised version based on reviewer comments."
              : "Submit your scientific communication to this event."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 rounded-2xl bg-white/10 border border-white/15"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Paper Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-400/40"
              placeholder="Enter paper title"
            />
          </div>

          {/* Abstract */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Abstract *
            </label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-400/40 resize-none"
              placeholder="Write your abstract here..."
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Keywords
            </label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none"
              placeholder="AI, cardiology, diagnosis"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Presentation Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PaperType)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            >
              <option value="ORAL">Oral Presentation</option>
              <option value="POSTER">Poster Presentation</option>
            </select>
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload Paper (PDF) *
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-white/80"
            />
            {file && (
              <p className="mt-2 text-sm text-white/70">
                Selected file: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600/80 hover:bg-blue-600 transition font-semibold border border-blue-300/30"
            >
              {isRevision ? "Submit Revision" : "Submit Paper"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/15"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
