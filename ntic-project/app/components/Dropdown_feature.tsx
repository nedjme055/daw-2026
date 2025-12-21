export default function dp2() {
  return (
    <div className="relative inline-block group">
      {/* Trigger */}
      <button
        className="flex items-center gap-1 px-4 py-2 rounded-xl
                   text-one hover:bg-gray-100/10
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
        className="absolute left-0 mt-2 w-72
                   rounded-2xl bg-white border border-gray-200
                   shadow-lg
                   opacity-0 invisible translate-y-2
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   transition-all duration-200"
      >
        <div className="p-2">
          <a
            href="#"
            className="flex items-start gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            📄
            <div>
              <p className="text-sm font-medium text-gray-900">
                Soumissions Scientifiques
              </p>
              <p className="text-xs text-gray-500">
                Gérer et suivre les soumissions
              </p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-start gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            👥
            <div>
              <p className="text-sm font-medium text-gray-900">
                Gestion des Participants
              </p>
              <p className="text-xs text-gray-500">
                Inscriptions et accès
              </p>
            </div>
          </a>

          <a
            href="#"
            className="flex items-start gap-3 px-4 py-3 rounded-xl
                       hover:bg-gray-100 transition"
          >
            📊
            <div>
              <p className="text-sm font-medium text-gray-900">
                Rapports & Statistiques
              </p>
              <p className="text-xs text-gray-500">
                Analyses et exportations
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
