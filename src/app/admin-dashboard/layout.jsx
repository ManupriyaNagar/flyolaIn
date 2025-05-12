"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  FaBars,
  FaHome,
  FaPlane,
  FaPlus,
  FaClock,
  FaBook,
  FaUsers,
  FaTimes,
  FaBell,
  FaCog,
  FaTicketAlt,
} from "react-icons/fa";
import { Home } from "lucide-react";
import Link from "next/link";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("[AdminDashboardLayout] Current pathname:", normalizedPathname);
    console.log("[AdminDashboardLayout] Current authState:", authState);
  }, [normalizedPathname, authState]);

  useEffect(() => {
    if (authState.isLoading) return;
  
    const token = localStorage.getItem("token");
    if (!authState.isLoggedIn || !token) {
      console.warn("User not authenticated. Redirecting...");
      router.push("/sign-in");
      return;
    }
  
    if (authState.userRole !== "1") {
      console.warn("User is not admin. Redirecting...");
      router.push("/");
    }
  }, [authState, router]);
  

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/admin-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  const activeClass = "bg-indigo-700 text-white";

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading authentication...</div>
      </div>
    );
  }
  if (!authState.isLoggedIn || authState.userRole !== "1") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100">
      <aside
        className={`fixed top-0 left-0 h-full z-20 w-72 p-6 flex flex-col overflow-y-auto transition-transform duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setSidebarVisible(false)}
            className="md:hidden text-white hover:text-gray-300"
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="space-y-4 flex-1">
          <Link
            href="/admin-dashboard"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaHome className="text-indigo-300" />
            Home
          </Link>
          <Link
            href="/admin-dashboard/bookflight"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/bookflight") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaPlane className="text-indigo-300" />
            Book Flight
          </Link>
          <Link
            href="/admin-dashboard/add-airport"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/add-airport") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaPlus className="text-indigo-300" />
            Add Airport
          </Link>
          <Link
            href="/admin-dashboard/add-flight"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/add-flight") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaPlus className="text-indigo-300" />
            Flight
          </Link>
          <Link
            href="/admin-dashboard/scheduled-flight"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/scheduled-flight") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaClock className="text-indigo-300" />
            Scheduled Flight
          </Link>
          <Link
            href="/admin-dashboard/booking-list"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/booking-list") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaBook className="text-indigo-300" />
            Booking List
          </Link>
          <Link
            href="/admin-dashboard/all-users"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/all-users") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaUsers className="text-indigo-300" />
            Manage Users
          </Link>
          <Link
            href="/admin-dashboard/booking-data"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/booking-data") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaClock className="text-indigo-300" />
            Booking Data
          </Link>
          <Link
            href="/admin-dashboard/tickets"
            className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
              isActive("/admin-dashboard/tickets") ? activeClass : "hover:bg-indigo-700 text-white"
            }`}
          >
            <FaTicketAlt className="text-indigo-300" />
            Get Ticket
          </Link>
        </nav>
      </aside>

      {isSidebarVisible && (
        <div
          onClick={() => setSidebarVisible(false)}
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          aria-hidden="true"
        />
      )}

      <main className="flex-1 relative md:ml-72">
        <header className="fixed top-0 left-0 right-0 md:left-72 bg-white shadow-md p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="md:text-4xl text-sm font-bold text-gray-800">
              Welcome Back, Admin!
            </h2>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-indigo-600">
              <Home size={20} />
            </a>
            <a href="/notifications" className="text-gray-600 hover:text-indigo-600">
              <FaBell size={20} />
            </a>
            <a href="/settings" className="text-gray-600 hover:text-indigo-600">
              <FaCog size={20} />
            </a>
            <button
              onClick={() => setSidebarVisible(!isSidebarVisible)}
              className="md:hidden text-black rounded-full"
              aria-label="Toggle sidebar"
            >
              <FaBars size={20} />
            </button>
          </nav>
        </header>

        <div className="pt-20 p-10 overflow-y-auto h-screen">
          <section className="bg-white p-8 rounded-2xl shadow-xl mt-12 border border-gray-200 transform transition-all hover:shadow-2xl">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}