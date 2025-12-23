import React from "react";
import Link from "next/link";
import { MapPin, Users, Calendar } from "lucide-react";

interface Category {
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
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  participants,
  category,
}) => {
  const card = (
    <div className="group bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Category */}
      <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400">
        {category.label}
      </span>

      {/* Title */}
      <h3 className="text-xl font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-slate-400 text-sm leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* Meta */}
      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={14} />
          <span>{participants} attendees</span>
        </div>
      </div>

      {/* CTA */}
      <button className="mt-6 w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition">
        View Details
      </button>
    </div>
  );

  if (id) {
    return <Link href={`/event?id=${id}`}>{card}</Link>;
  }

  return card;
};

export default EventCard;
