import React from 'react';
import Dropdown from "./Dropdown";
import Dropdown_feature from "./Dropdown_feature";
import Link from "next/link";

export default function Navbar() {
  return (
<nav className=" backdrop-blur-sm bg-transparent sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
             <Link href="/" >
               <img src="/assets/Asset 1.png" alt="" className="h-10"/>
              </Link>
              
            </div>
            <div>
               <Dropdown />
               <Dropdown_feature />
            </div>
            <div className="hidden md:flex items-center space-x-3">
            <Link rel="stylesheet" href="./signup" >
             <button className=" hover:bg-blue-700 transition-all duration-300 cursor-pointer px-6 py-2 bg-transparent  p-3 px-3.5 rounded-xl text-one border border-one rounded-xl transition-colors text-sm font-medium ">
                Register
              </button>
              
              </Link>
              <Link rel="stylesheet" href="./login" >
              <button  className="cursor-pointer px-6 py-2 bg-one  hover:bg-gray-100 p-3 px-3.5 rounded-xl text-two rounded-lg transition-colors text-sm font-medium ">
                Login
              </button>
              </Link>
            </div>
            
          </div>
        </div>
      </nav>)}