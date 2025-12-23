export default function D2() {
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <button
        className="flex items-center gap-1 px-4 py-2 rounded-xl
                   text-one hover:bg-white/10
                   transition-colors duration-200"
      >
        Features
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className="absolute left-0 mt-2 w-80
                   rounded-2xl bg-white border border-gray-200
                   shadow-xl
                   opacity-0 invisible translate-y-2
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   transition-all duration-200"
      >
        <div className="p-2">
          {/* Submissions */}
          <a
            href="/features/submissions"
            className="flex items-start gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6 text-gray-700 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Scientific Submissions
              </p>
              <p className="text-xs text-gray-500">
                Abstract submission, review & decisions
              </p>
            </div>
          </a>

          {/* Participants */}
          <a
            href="/features/participants"
            className="flex items-start gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6 text-gray-700 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Participant Management
              </p>
              <p className="text-xs text-gray-500">
                Registrations, badges & access control
              </p>
            </div>
          </a>

          {/* Stats */}
          <a
            href="/features/statistics"
            className="flex items-start gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6 text-gray-700 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Reports & Statistics
              </p>
              <p className="text-xs text-gray-500">
                Analytics, exports & certificates
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
