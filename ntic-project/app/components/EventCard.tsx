import React from 'react';
import Link from "next/link";

interface Category {
  icon: string;
  label: string;
}

interface EventCardProps {
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: string;
  category: Category;
  gradient?: string;
  badge?: string | null;
  badgeColor?: string;
  onRegister?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  participants,
  category,
  gradient = "from-blue-600 to-purple-700",
  badge = null,
  badgeColor = "bg-red-500",
  onRegister
}) => {
  const card = (
    <div className="group bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl shadow-xl">
      {/* Event Header with Gradient */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%]"></div>
        </div>
        
        {/* Category Badge */}
        <div className="relative text-center text-white z-10">
          <div className="text-5xl font-bold tracking-tight drop-shadow-lg">
            {category.icon}
          </div>
          <div className="text-sm font-medium mt-3 uppercase tracking-wider">
            {category.label}
          </div>
        </div>
        
        {/* Status Badge */}
        {badge && (
          <div className={`absolute top-4 right-4 ${badgeColor} text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg`}>
            {badge}
          </div>
        )}

        {/* Corner Decoration */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full"></div>
      </div>

      {/* Event Content */}
      <div className="p-6 space-y-4">
        {/* Date */}
        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
          <img src="assets/Asset 1.png" alt="" />
          <span>{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/50"></div>

        {/* Footer with Participants and CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              
            </div>
            <span className="text-sm text-slate-400">
               {participants} attendees
            </span>
          </div>
          
          <button 
            onClick={onRegister}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );

  if (id) {
    return (
      <Link href={`/event?id=${id}`}>
        {card}
      </Link>
    );
  }

  return card;
};

export default EventCard;