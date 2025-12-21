export default function dp1() {
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <button
        className="flex items-center gap-1 px-4 py-2 rounded-xl
                   text-one hover:bg-gray-100/10
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
                   shadow-lg
                   opacity-0 invisible translate-y-2
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   transition-all duration-200"
      >
        <div className="p-2">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-sm text-gray-800 hover:bg-gray-100 transition"
          >
            📅 Upcoming Events
          </a>

          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-sm text-gray-800 hover:bg-gray-100 transition"
          >
            🕘 Past Events
          </a>

          <div className="my-1 border-t border-gray-200" />

          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-sm font-medium text-blue-600
                       hover:bg-blue-50 transition"
          >
            ➕ Create Event
          </a>
        </div>
      </div>
    </div>
  );
}
