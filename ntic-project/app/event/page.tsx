'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatar: string;
}

interface ProgramSession {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  type: 'keynote' | 'panel' | 'workshop' | 'break';
}

interface Organizer {
  id: string;
  name: string;
  role: string;
  email: string;
}

const EventDetailsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') ?? null;

  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'speakers'>('overview');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mock event data - replace with API call using `id`
  const event = {
    id: id ?? '1',
    title: 'International AI & Machine Learning Conference 2025',
    shortDescription: 'Leading conference on artificial intelligence and machine learning',
    fullDescription:
      'Join us for the premier conference on artificial intelligence and machine learning. This three-day event brings together researchers, practitioners, and industry leaders to share cutting-edge research, innovative applications, and future directions in AI. Explore deep learning, natural language processing, computer vision, reinforcement learning, and more.',
    date: 'March 15-17, 2025',
    startDate: '2025-03-15',
    endDate: '2025-03-17',
    location: 'Paris Convention Center, Paris, France',
    category: 'AI & Technology',
    participants: 450,
    maxCapacity: 500,
    registrationDeadline: 'March 1, 2025',
    cfpOpen: true,
    cfpDeadline: 'February 15, 2025',
    gradient: 'from-blue-600 to-purple-700',
    organizers: [
      { id: '1', name: 'Dr. Sarah Johnson', role: 'Conference Chair', email: 'sarah.j@conference.org' },
      { id: '2', name: 'Prof. Michael Chen', role: 'Program Committee Chair', email: 'michael.c@conference.org' },
      { id: '3', name: 'Dr. Emma Williams', role: 'Local Arrangements', email: 'emma.w@conference.org' }
    ] as Organizer[],
    speakers: [
      { id: '1', name: 'Dr. Alex Thompson', title: 'Keynote Speaker', organization: 'MIT AI Lab', avatar: 'AT' },
      { id: '2', name: 'Prof. Maria Garcia', title: 'Panel Moderator', organization: 'Stanford University', avatar: 'MG' },
      { id: '3', name: 'Dr. James Liu', title: 'Workshop Leader', organization: 'Google AI', avatar: 'JL' },
      { id: '4', name: 'Dr. Sofia Martinez', title: 'Invited Speaker', organization: 'DeepMind', avatar: 'SM' }
    ] as Speaker[],
    program: [
      { id: '1', time: '09:00 - 09:30', title: 'Registration & Welcome Coffee', type: 'break' as const },
      { id: '2', time: '09:30 - 10:30', title: 'Opening Keynote: The Future of AI', speaker: 'Dr. Alex Thompson', type: 'keynote' as const },
      { id: '3', time: '10:45 - 12:00', title: 'Panel: Ethics in AI Development', speaker: 'Prof. Maria Garcia', type: 'panel' as const },
      { id: '4', time: '12:00 - 13:30', title: 'Lunch Break', type: 'break' as const },
      { id: '5', time: '13:30 - 15:00', title: 'Workshop: Building Neural Networks', speaker: 'Dr. James Liu', type: 'workshop' as const },
      { id: '6', time: '15:15 - 16:45', title: 'Research Presentations Track A', type: 'panel' as const },
      { id: '7', time: '17:00 - 18:00', title: 'Networking Reception', type: 'break' as const }
    ] as ProgramSession[]
  };

  const handleRegister = () => setShowRegisterModal(true);
  const handleSubmitCommunication = () => setShowSubmitModal(true);

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      case 'panel':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      case 'workshop':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'break':
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-br ${event.gradient} py-20 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                {event.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{event.title}</h1>
              <p className="text-xl text-white/90 mb-6">{event.shortDescription}</p>

              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>
                    {event.participants}/{event.maxCapacity} Registered
                  </span>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-fit border border-white/20">
              <h3 className="text-xl font-bold mb-4">Join This Event</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Registration Deadline</span>
                  <span className="font-semibold">{event.registrationDeadline}</span>
                </div>
                {event.cfpOpen && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">CFP Deadline</span>
                    <span className="font-semibold">{event.cfpDeadline}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRegister}
                  className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-lg"
                >
                  Register as Participant
                </button>

                {event.cfpOpen && (
                  <button
                    onClick={handleSubmitCommunication}
                    className="w-full px-6 py-3 bg-blue-600/20 text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-blue-600/30 transition-all"
                  >
                    Submit Communication
                  </button>
                )}
              </div>

              {event.cfpOpen && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-sm text-green-300 font-semibold">📢 Call for Papers is Open!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-700 sticky top-0 bg-slate-900/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {(['overview', 'program', 'speakers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold capitalize transition-colors relative ${
                  activeTab === tab ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">About This Event</h2>
                <p className="text-slate-300 leading-relaxed text-lg">{event.fullDescription}</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Key Topics</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'AI Ethics', 'Machine Learning Applications'].map((topic) => (
                    <div key={topic} className="flex items-center gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Organizers Sidebar */}
            <div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Event Organizers</h3>
                <div className="space-y-4">
                  {event.organizers.map((organizer) => (
                    <div key={organizer.id} className="space-y-1">
                      <p className="font-semibold text-white">{organizer.name}</p>
                      <p className="text-sm text-blue-400">{organizer.role}</p>
                      <a href={`mailto:${organizer.email}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                        {organizer.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Program Tab */}
        {activeTab === 'program' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Conference Program</h2>
            <div className="space-y-3">
              {event.program.map((session) => (
                <div key={session.id} className={`border rounded-xl p-6 ${getSessionColor(session.type)} transition-all hover:scale-[1.01]`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono font-semibold">{session.time}</span>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded-full uppercase tracking-wide">{session.type}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{session.title}</h3>
                      {session.speaker && <p className="text-sm opacity-80">{session.speaker}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speakers Tab */}
        {activeTab === 'speakers' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Featured Speakers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {event.speakers.map((speaker) => (
                <div key={speaker.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {speaker.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                      <p className="text-blue-400 text-sm mb-2">{speaker.title}</p>
                      <p className="text-slate-400 text-sm">{speaker.organization}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Register for Event</h3>
            <p className="text-slate-400 mb-6">Fill out the registration form to secure your spot at {event.title}.</p>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" />
              <input type="text" placeholder="Organization" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRegisterModal(false)} className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">Complete Registration</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Communication Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Submit Your Communication</h3>
            <p className="text-slate-400 mb-6">Submit your abstract for consideration. Deadline: {event.cfpDeadline}</p>
            <div className="space-y-4">
              <input type="text" placeholder="Paper Title" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" />
              <textarea placeholder="Abstract (max 300 words)" rows={4} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none" />
              <input type="text" placeholder="Keywords (comma-separated)" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSubmitModal(false)} className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">Submit Paper</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;