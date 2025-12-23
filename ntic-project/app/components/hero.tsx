"use client";

import React from "react";

export default function Hero() {
  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (!section) return;

    const y = section.getBoundingClientRect().top + window.pageYOffset - 80; // sticky navbar height

    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
            The Conference Software
            <span className="block mt-3 text-transparent bg-clip-text bg-one font-light">
              for Medical Organizations
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80">
            Manage scientific events, submissions, participants and statistics
            from one unified platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {/* Primary */}
            <button
              onClick={() => {
                document
                  .getElementById("upcoming-events")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-10 py-4 rounded-xl bg-one text-two font-semibold hover:bg-gray-200 transition-all"
            >
              View Upcoming Events
            </button>

            {/* Secondary */}
            <button
              onClick={() => scrollToSection("features")}
              className="px-10 py-4 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Learn How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
