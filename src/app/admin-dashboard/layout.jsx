"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import AdminDebugPanel from "@/components/AdminDebugPanel";
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
  FaChartBar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { 
  Home, 
  ToyBrickIcon, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  User,
  LogOut
} from "lucide-react";
import Link from "next/link";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/admin-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
  };

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-80 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl border-r border-slate-700/50`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                <FaPlane className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Flyola Admin
                </h1>
                <p className="text-xs text-slate-400">Management Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarVisible(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
              <FaUserShield className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Administrator</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Dashboard Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
              Dashboard
            </p>
            <Link
              href="/admin-dashboard"
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                isActive("/admin-dashboard") 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                  : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
              }`}
            >
              <FaHome className={`text-lg ${isActive("/admin-dashboard") ? "text-white" : "text-blue-400"}`} />
              <span className="font-medium">Overview</span>
              {isActive("/admin-dashboard") && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          </div>

          {/* Flight Management */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
              Flight Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/add-airport"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/add-airport") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaMapMarkerAlt className={`text-lg ${isActive("/admin-dashboard/add-airport") ? "text-white" : "text-emerald-400"}`} />
                <span className="font-medium">Airport Management</span>
                {isActive("/admin-dashboard/add-airport") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/add-flight"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/add-flight") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaPlane className={`text-lg ${isActive("/admin-dashboard/add-flight") ? "text-white" : "text-sky-400"}`} />
                <span className="font-medium">Flight Management</span>
                {isActive("/admin-dashboard/add-flight") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/scheduled-flight"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/scheduled-flight") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaCalendarAlt className={`text-lg ${isActive("/admin-dashboard/scheduled-flight") ? "text-white" : "text-purple-400"}`} />
                <span className="font-medium">Scheduled Flights</span>
                {isActive("/admin-dashboard/scheduled-flight") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            </div>
          </div>

          {/* Booking Management */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
              Booking Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/booking-list"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/booking-list") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaBook className={`text-lg ${isActive("/admin-dashboard/booking-list") ? "text-white" : "text-orange-400"}`} />
                <span className="font-medium">All Bookings</span>
                {isActive("/admin-dashboard/booking-list") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/booking-data"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/booking-data") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaChartBar className={`text-lg ${isActive("/admin-dashboard/booking-data") ? "text-white" : "text-pink-400"}`} />
                <span className="font-medium">Booking Analytics</span>
                {isActive("/admin-dashboard/booking-data") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/tickets"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/tickets") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaTicketAlt className={`text-lg ${isActive("/admin-dashboard/tickets") ? "text-white" : "text-yellow-400"}`} />
                <span className="font-medium">Ticket Management</span>
                {isActive("/admin-dashboard/tickets") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            </div>
          </div>

          {/* Joy Ride Management */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
              Joy Ride Services
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/bookid-joyride"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/bookid-joyride") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <ToyBrickIcon className={`text-lg ${isActive("/admin-dashboard/bookid-joyride") ? "text-white" : "text-green-400"}`} />
                <span className="font-medium">Joy Ride Booking</span>
                {isActive("/admin-dashboard/bookid-joyride") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/all-joyride-slots"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/all-joyride-slots") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaClock className={`text-lg ${isActive("/admin-dashboard/all-joyride-slots") ? "text-white" : "text-cyan-400"}`} />
                <span className="font-medium">Available Slots</span>
                {isActive("/admin-dashboard/all-joyride-slots") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/all-joyride-booking"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/all-joyride-booking") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaBook className={`text-lg ${isActive("/admin-dashboard/all-joyride-booking") ? "text-white" : "text-rose-400"}`} />
                <span className="font-medium">Joy Ride Bookings</span>
                {isActive("/admin-dashboard/all-joyride-booking") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
              User Management
            </p>
            <Link
              href="/admin-dashboard/all-users"
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                isActive("/admin-dashboard/all-users") 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                  : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
              }`}
            >
              <FaUsers className={`text-lg ${isActive("/admin-dashboard/all-users") ? "text-white" : "text-indigo-400"}`} />
              <span className="font-medium">Manage Users</span>
              {isActive("/admin-dashboard/all-users") && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 group"
          >
            <FaSignOutAlt className="text-lg text-red-400" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>



      {/* Overlay for mobile */}
      {isSidebarVisible && (
        <div
          onClick={() => setSidebarVisible(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative md:ml-80">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarVisible(!isSidebarVisible)}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label="Toggle sidebar"
              >
                <FaBars size={20} className="text-slate-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Welcome Back, Admin!
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your flight operations efficiently
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-40"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings */}
              <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                <Settings size={20} className="text-slate-600" />
              </button>
              
              {/* Profile */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                <User size={18} />
                <span className="text-sm font-medium hidden sm:block">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      {/* Debug Panel - Only in development */}
      {process.env.NODE_ENV === 'development' && <AdminDebugPanel />}
    </div>
    </RouteGuard>
  );
}