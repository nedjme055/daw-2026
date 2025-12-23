export default function D1() {
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <button
        className="flex items-center gap-1 px-4 py-2 rounded-xl
                   text-one hover:bg-white/10
                   transition-colors duration-200"
      >
        Events
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
        className="absolute left-0 mt-2 w-64
                   rounded-2xl bg-white border border-gray-200
                   shadow-xl
                   opacity-0 invisible translate-y-2
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   transition-all duration-200"
      >
        <div className="p-2">
          {/* Upcoming */}
          <a
            href="/events"
            className="flex items-center gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Upcoming Events
              </p>
              <p className="text-xs text-gray-500">
                Discover future conferences
              </p>
            </div>
          </a>

          {/* Past */}
          <a
            href="/events/past"
            className="flex items-center gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M12 22a10 10 0 100-20 10 10 0 000 20z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Past Events
              </p>
              <p className="text-xs text-gray-500">
                Archives & proceedings
              </p>
            </div>
          </a>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200" />

          {/* Create */}
          <a
            href="/dashboard/organizer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl
                       text-blue-600 hover:bg-blue-50 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-semibold">
              Create Event
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
