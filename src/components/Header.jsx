"use client"

import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Personal Charter",
    "Hire Charter",
    "Business Class Charter",
    "Jet Hire",
    "Helicopter Hire",
    "Download Tickets",
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 fixed top-4 left-0 right-0 z-50">
        <div className="bg-white shadow-lg rounded-full border border-gray-100 flex justify-between items-center p-4 px-6 transition-all duration-300 hover:shadow-xl">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Flyola Logo"
                width={120}
                height={60}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
                priority
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="relative text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Sign In Button */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
              <span className="mr-2">🔑</span> Sign In / Register
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 mx-4 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 animate-slide-down">
            <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                <span className="mr-2">🔑</span> Sign In / Register
              </button>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

// Add this in your global CSS or a <style> tag in _app.js/_document.js
const styles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-down {
    animation: slideDown 0.3s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}