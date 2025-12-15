import React from 'react';
import EventCard from "./EventCard";
export default function Features() {
  return (
<section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fonctionnalités Complètes
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Une solution tout-en-un pour gérer chaque aspect de vos événements scientifiques
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Soumissions Scientifiques</h3>
              <p className="text-slate-400 leading-relaxed">
                Gestion complète des appels à communications, évaluations par le comité scientifique et suivi des décisions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gestion des Participants</h3>
              <p className="text-slate-400 leading-relaxed">
                Inscriptions en ligne, badges personnalisés, suivi des présences et communication ciblée avec les participants.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rapports & Statistiques</h3>
              <p className="text-slate-400 leading-relaxed">
                Génération automatique d&apos;attestations, statistiques détaillées et rapports de participation en temps réel.
              </p>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <EventCard 
              id="1"
              title="Event One"
              description="Short description for event one."
              date="9 November"
              location="Constantine"
              participants="120"
              category={{ icon: "🎯", label: "Conference" }}
            />
            <EventCard 
              id="2"
              title="Event Two"
              description="Short description for event two."
              date="12 December"
              location="Algiers"
              participants="80"
              category={{ icon: "🧪", label: "Workshop" }}
            />
            <EventCard 
              id="3"
              title="Event Three"
              description="Short description for event three."
              date="5 January"
              location="Oran"
              participants="200"
              category={{ icon: "📢", label: "Symposium" }}
            />
          </div>
        </div>
      </section> )}