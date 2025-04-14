"use client";
import { FaPlane } from "react-icons/fa";

const Header2 = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-indigo-700 shadow-2xl top-0 border-b border-indigo-300 rounded-3xl mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          <FaPlane className="inline mr-2" /> Flight Options
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-1 sm:mt-2">Discover your next journey</p>
      </div>
    </header>
  );
};

export default Header2;