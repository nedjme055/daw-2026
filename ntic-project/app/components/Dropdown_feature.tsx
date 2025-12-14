export default function Dropdown_feature() {
  return (
    <div className="relative inline-block group "  >
      {/* Trigger */}
      <button className="rounded-xl hover:bg-gray-100/10 px-4 py-2 text-one  flex items-center space-x-1">
        Features <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
      </button>

      {/* Dropdown */}
      <div className=" p-2 absolute left-0 mt-2 w-60 bg-white border rounded-2xl shadow-md
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200">
    <a className="text-black block  m-1 px-4 py-2 text-left hover:bg-gray-100 rounded-xl " href="#">
          Soumissions Scientifiques
        </a>
        <a className="text-black m-1  block px-4 py-2 text-left hover:bg-gray-100 rounded-xl " href="#">
          Gestion des Participants
        </a>
        <a className="text-black m-1 block px-4 py-2 text-left hover:bg-gray-100 rounded-xl " href="#">
          Rapports & Statistiques
        </a>
      </div>
    </div>
  );
}
