"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import {  FaUserAstronaut } from "react-icons/fa";

// Hook to detect clicks outside of a ref
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Navigation items with corrected paths
const NAV_ITEMS = [
  { name: "Personal Charter", path: "/personal-charter" },
  { name: "Hire Charter", path: "/hire-charter" },
  { name: "Business Class Charter", path: "/business-class-charter" },
  { name: "Jet Hire", path: "/jet-hire" },
  { name: "Helicopter Hire", path: "/helicopter-hire" },
  { name: "Marriage", path: "/hire-for-marriage" },
];

// Mobile menu toggle button
const MobileMenuButton = memo(({ isOpen, onClick }) => (
  <button
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
    onClick={onClick}
  >
    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
      />
    </svg>
  </button>
));

// Reusable nav links component
const NavLinks = memo(({ items, activePath, onClick, isMobile = false }) => (
  items.map(({ name, path }) => {
    const isActive = activePath === path;
    const baseClass = isMobile
      ? "block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg"
      : "relative text-gray-800 hover:text-indigo-600";
    return (
      <Link
        key={path}
        href={path}
        className={`transition-colors duration-200 ${baseClass} ${isActive && "text-indigo-600 font-semibold"}`}
        onClick={onClick}
      >
        {name}
        {!isMobile && (
          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
          />
        )}
      </Link>
    );
  })
));

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { authState, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();
  const menuRef = useRef();

  // Close dropdowns when clicking outside
  useOnClickOutside(profileRef, () => setIsProfileOpen(false));
  useOnClickOutside(menuRef, () => setIsMenuOpen(false));

  // Handle scroll to add shadow and backdrop
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen((o) => !o), []);
  const toggleProfile = useCallback(() => setIsProfileOpen((o) => !o), []);

  const handleDashboard = useCallback(() => {
    const path = authState.userRole === 1 ? "/admin-dashboard" : "/user-dashboard";
    router.push(path);
    setIsProfileOpen(false);
  }, [authState.userRole, router]);

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
  }, [logout]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-lg px-4 sm:px-6 lg:px-8 transition-all duration-300 rounded-b-3xl
        ${isScrolled ? "bg-white/90 shadow-lg" : "bg-white/70"}`}
    >
      <div className="max-w-11xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-04.png"
            alt="Flyola Logo"
            width={120}
            height={60}
            priority
            className="w-28 hover:scale-105 transition-transform duration-200"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
          <NavLinks items={NAV_ITEMS} activePath={pathname} />
        </nav>

        <div className="flex items-center gap-4">
          {authState.isLoggedIn ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={toggleProfile}
                className="focus:outline-none rounded-full"
                aria-label="User menu"
              >
            <FaUserAstronaut className="w-8 h-8 text-blue-700 hover:text-indigo-600 transition-colors duration-200" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down">
                  <button
                    onClick={handleDashboard}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="hidden md:flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🔑</span>
              Sign In / Register
            </Link>
          )}
          <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden mx-4 mt-2 bg-white/90 rounded-xl shadow-lg border border-gray-100 animate-slide-down backdrop-blur-md">
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
            <NavLinks
              items={NAV_ITEMS}
              activePath={pathname}
              onClick={() => setIsMenuOpen(false)}
              isMobile
            />
            {authState.isLoggedIn ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium text-sm shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-full bg-red-500 text-white font-medium text-sm shadow-md hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
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
  );
};

export default memo(Header);
