// components/Header.jsx
"use client";
import { FaPlane } from "react-icons/fa";

const Header2 = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-indigo-700 shadow-2xl top-0 border-b border-indigo-300">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          <FaPlane className="inline mr-2" /> Flight Options
        </h1>
        <p className="text-lg text-gray-200 mt-2">Discover your next journey</p>
      </div>
    </header>
  );
};

export default Header2;