"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiClock,
  FiDollarSign,
  FiHelpCircle,
  FiCreditCard,
  FiBell,
  FiSettings,
} from "react-icons/fi";
import { Home } from "lucide-react";

// Helper to remove trailing slashes for normalized path matching
const normalizePath = (path) => path.replace(/\/+$/, "");

export default function UserDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  // Determine if a nav link is active
  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    // For the Dashboard link, require an exact match.
    if (normalizedHref === "/user-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    // Otherwise, check if the current path starts with the provided link.
    return normalizedPathname.startsWith(normalizedHref);
  };

  const activeClass = "bg-indigo-700 text-white";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Reusable navigation link component; clicking a link hides the sidebar on mobile
  const NavLink = ({ href, icon, label }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors text-lg font-medium ${
        isActive(href)
          ? activeClass
          : "hover:bg-indigo-700 text-white"
      }`}
      onClick={() => setSidebarVisible(false)}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-20 w-72 p-6 flex flex-col overflow-y-auto transition-transform duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-indigo-800 text-white shadow-xl`}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Flyola</h1>
            <p className="text-indigo-200 mt-2">User Dashboard</p>
          </div>
          {/* Close sidebar button for mobile */}
          <button
            onClick={() => setSidebarVisible(false)}
            className="md:hidden text-white hover:text-gray-300"
            aria-label="Close sidebar"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavLink
            href="/user-dashboard"
            icon={<FiHome size={20} />}
            label="Dashboard"
          />
          <NavLink
            href="/user-dashboard/bookings"
            icon={<FiClock size={20} />}
            label="Booking History"
          />
          <NavLink
            href="/user-dashboard/pnr-status"
            icon={<FiCreditCard size={20} />}
            label="PNR Status"
          />
          <NavLink
            href="/user-dashboard/refunds"
            icon={<FiDollarSign size={20} />}
            label="Refund Requests"
          />
          <NavLink
            href="/user-dashboard/payments"
            icon={<FiCreditCard size={20} />}
            label="Payments"
          />
          <NavLink
            href="/user-dashboard/support"
            icon={<FiHelpCircle size={20} />}
            label="Support Tickets"
          />
          <NavLink
            href="/user-dashboard/profile"
            icon={<FiUser size={20} />}
            label="Profile Settings"
          />
        </nav>

        {/* Logout Section */}
        <div className="border-t border-indigo-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition-all text-lg font-medium"
          >
            <FiLogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarVisible && (
        <div
          onClick={() => setSidebarVisible(false)}
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Toggle Sidebar Button (mobile only) */}
     
      {/* Main Content Area */}
      <main className="flex-1 relative md:ml-72">
        {/* Fixed Header in the Main Content Area */}
        <header className="fixed top-0 left-0 right-0 md:left-72 bg-white shadow-md p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            
          </div>
          <nav className="flex items-center space-x-4">

          <Link href="/" className="text-gray-600 hover:text-indigo-600">
              <Home size={24} />
            </Link>


            <Link href="/#" className="text-gray-600 hover:text-indigo-600">
              <FiBell size={24} />
            </Link>
            <Link href="/#" className="text-gray-600 hover:text-indigo-600">
              <FiUser size={24} />
            </Link>

            <button
        onClick={() => setSidebarVisible(!isSidebarVisible)}
        className="  md:hidden b  rounded-full shadow-lg text-black transition-colors"
        aria-label="Toggle sidebar"
      >
        <FiMenu size={24} />
      </button>

          </nav>
        </header>

        {/* Main Content Below the Fixed Header */}
        <div className="pt-20 p-10 overflow-y-auto h-screen ">
          <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}
