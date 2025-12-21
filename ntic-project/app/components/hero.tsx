import React from 'react';

export default function Hero() {
  return (
<section className="flex relative overflow-hidden items-center justify-center min-h-[calc(100vh-64px)]">
        <div className=" mx-auto px-6 py-10 sm:py-16 lg:py-20">
          <div className="flex justify-center items-center">
            {/* Left Content */}
            <div className="space-y-8  ">
              
              
              <h1 className=" text-center text-5xl md:text-6xl font-bold text-white leading-tight text-ali">
                The Conference Software
                <span className="block mb-0 pb-0 mt-2 text-transparent bg-clip-text bg-one font-light">
                  for Medical Organizations
                </span>
              </h1>
              
              <p className=" mt-0 pt-0 text-center text-xl text-one leading-relaxed">
                Minimize organizer workload and connect attendees
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button className="cursor-pointer px-11 py-4 bg-transparent text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transform border  border-one">
                  Create Event
                </button>
                <button className="cursor-pointer px-8 py-4 bg-one text-two rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold border">
                  Explore our events
                </button>
              </div>

              {/* Stats */}
              
            </div>

             
          </div>
        </div>
      </section>)}