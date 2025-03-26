"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items with their respective paths
  const navItems = [
    { name: "Personal Charter", path: "/Personal-chater" },
    { name: "Hire Charter", path: "/Hire-Charter" },
    { name: "Business Class Charter", path: "/Business-class" },
    { name: "Jet Hire", path: "/Jet-hire" },
    { name: "Helicopter Hire", path: "/helicopter" },
    { name: "Download Tickets", path: "/Tickets" },
  ];

  return (
    <div className="relative">
      {/* Header */}
      <header
        className={`w-full max-w-11xl px-4 sm:px-6 lg:px-8 py-4 fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? "bg-white/80 shadow-md" : "bg-white/40"
        } rounded-b-3xl`}
      >
        <div className="flex justify-between items-center p-2 px-6 transition-all duration-300">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-04.png"
                alt="Flyola Logo"
                width={120}
                height={60}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="relative text-gray-700 hover:text-indigo-600 transition-colors duration-200 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Sign In Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/SignIn"
              className="hidden md:flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🔑</span> Sign In / Register
            </Link>

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
                  d={
                    isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 mx-4 mt-2 bg-white/90 rounded-xl shadow-lg border border-gray-100 animate-slide-down backdrop-blur-md">
            <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/signin"
                className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">🔑</span> Sign In / Register
              </Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;