import React from 'react';
import Dropdown from "./components/Dropdown";
import Dropdown_feature from "./components/Dropdown_feature";
import EventCard from "./components/EventCard";
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Features from "./components/features";
import Footer from "./components/footer";
const HomePage = () => {
  return (
    <div className=" min-h-screen w-full
  bg-[linear-gradient(110deg,#2a1f5d_0%,#1f3fa3_40%,#2f6df6_70%,#9aa7ff_100%)]
  text-white">
      
      <Navbar />
      <Hero />
      <Features />
      <Footer />
      {/* Footer */}
      
    </div>
  );
};

export default HomePage;
