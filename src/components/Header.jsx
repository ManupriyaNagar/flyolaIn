// components/Header.js
"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

// Static data
const NAV_ITEMS = [
  { name: "Personal Charter", path: "/personalchater" },
  { name: "Hire Charter", path: "/hirecharter" },
  { name: "Business Class Charter", path: "/business-class" },
  { name: "Jet Hire", path: "/jet-hire" },
  { name: "Helicopter Hire", path: "/helicopter" },
  { name: "Download Tickets", path: "/tickets" },
];

const MobileMenuButton = memo(({ isMenuOpen, toggleMenu }) => (
  <button
    className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
    onClick={toggleMenu}
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
));

const Header = () => {
  const router = useRouter();
  const { authState, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = useCallback(() => {
    const dashboardPath = authState.userRole === 1 ? "/admin-dashboard" : "/user-dashboard";
    router.push(dashboardPath);
  }, [authState.userRole, router]);

  const renderNavLinks = useCallback(
    (isMobile = false) =>
      NAV_ITEMS.map((item, index) => (
        <Link
          key={index}
          href={item.path}
          className={`${isMobile ? "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg" : "relative text-gray-950 hover:text-indigo-600"} transition-colors duration-200 group`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          {item.name}
          {!isMobile && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300" />
          )}
        </Link>
      )),
    []
  );

  return (
    <div className="relative">
      <header
        className={`w-full max-w-11xl px-4 sm:px-6 lg:px-8  fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? "bg-white/90 shadow-md" : "bg-white/70"
        } rounded-b-3xl`}
      >
        <div className="flex justify-between items-center p-2 px-6 transition-all duration-300">
          {/* Wrap Logo with Link */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image
                src="/logo-04.png"
                alt="Flyola Logo"
                width={120}
                height={60}
                priority
                className="hover:scale-105 transition-transform duration-200 w-28"
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {renderNavLinks()}
          </nav>

          <div className="flex items-center gap-4">
            {authState.isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <button
                    onClick={handleDashboardClick}
                    className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2">👤</span> Go to Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2">🚪</span> Logout
                  </button>
                </div>
                <MobileMenuButton isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden md:flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="mr-2">🔑</span> Sign In / Register
                </Link>
                <MobileMenuButton isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 mx-4 mt-2 bg-white/90 rounded-xl shadow-lg border border-gray-100 animate-slide-down backdrop-blur-md">
            <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
              {renderNavLinks(true)}
              {authState.isLoggedIn ? (
                <button
                  onClick={handleDashboardClick}
                  className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
              ) : (
                <Link
                  href="/sign-in"
                  className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default memo(Header);
