"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaHome,
  FaPlane,
  FaPlus,
  FaClock,
  FaBook,
  FaUsers,
  FaTimes,
} from "react-icons/fa";

// Function to remove trailing slashes
const normalizePath = (path) => path.replace(/\/+$/, "");

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // Updated helper function using normalized paths.
  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    // For the Home link, ensure an exact match.
    if (normalizedHref === "/admin-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    // For other links, check if the current path starts with the normalized href.
    return normalizedPathname.startsWith(normalizedHref);
  };

  const activeClass = "bg-indigo-700 text-white";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } w-72 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-2xl p-6 flex flex-col fixed top-0 left-0 h-full overflow-y-auto z-20 transition-transform duration-300 md:translate-x-0 mt-14`}
      >
        <div className="flex items-center justify-between mb-8 mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setSidebarVisible(false)}
            className="md:hidden text-white hover:text-gray-300"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="space-y-4 flex-1">
          <a
            href="/admin-dashboard"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaHome className="text-indigo-300" />
            Home
          </a>

          <a
            href="/admin-dashboard/bookflight"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/bookflight") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaPlane className="text-indigo-300" />
            Book Flight
          </a>

          <a
            href="/admin-dashboard/add-airport"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/add-airport") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaPlus className="text-indigo-300" />
            Add Airport
          </a>

          <a
            href="/admin-dashboard/add-flight"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/add-flight") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaPlus className="text-indigo-300" />
            Flight
          </a>

          <a
            href="/admin-dashboard/scheduled-flight"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/scheduled-flight") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaClock className="text-indigo-300" />
            Scheduled Flight
          </a>

          <a
            href="/admin-dashboard/booking-list"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/booking-list") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaBook className="text-indigo-300" />
            Booking List
          </a>

          <a
            href="/admin-dashboard/all-users"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/all-users") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaUsers className="text-indigo-300" />
            Manage Users
          </a>


          <a
            href="/admin-dashboard/booking-data"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/booking-data") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaClock className="text-indigo-300" />
          Booking data
          </a>
        </nav>
      </aside>

      {/* Button to toggle Sidebar */}
      <button
        onClick={() => setSidebarVisible(!isSidebarVisible)}
        className="fixed top-5 left-5 z-30 md:hidden bg-indigo-800 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <FaBars size={20} />
      </button>

      {/* Main Content */}
      <main className="flex-1 mt-14 ml-72 p-10 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-indigo-600">
            Welcome Back!
          </h2>
          <p className="text-gray-500 mt-2">Here’s what’s happening today.</p>
        </header>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 transform transition-all hover:shadow-2xl">
          {children}
        </section>
      </main>
    </div>
  );
}
