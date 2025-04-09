"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser, FiHome, FiClock, FiDollarSign, FiHelpCircle, FiCreditCard, FiSettings } from 'react-icons/fi';

export default function UserDashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-indigo-800 text-white shadow-xl p-6 flex flex-col fixed top-0 left-0 h-full overflow-y-auto z-20">
        {/* Header */}
        <div className="mb-10 mt-20">
          <h1 className="text-3xl font-extrabold tracking-tight">Flyola</h1>
          <p className="text-indigo-200 mt-2">User Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 ">
          <NavLink href="/user-dashboard" icon={<FiHome />} label="Dashboard" />
          <NavLink href="/user-dashboard/bookings" icon={<FiClock />} label="Booking History" />
          <NavLink href="/user-dashboard/pnr-status" icon={<FiCreditCard />} label="PNR Status" />
          <NavLink href="/user-dashboard/refunds" icon={<FiDollarSign />} label="Refund Requests" />
          <NavLink href="/user-dashboard/payments" icon={<FiCreditCard />} label="Payments" />
          <NavLink href="/user-dashboard/support" icon={<FiHelpCircle />} label="Support Tickets" />
          <NavLink href="/user-dashboard/profile" icon={<FiUser />} label="Profile Settings" />
        </nav>

        {/* Logout Section */}
        <div className="border-t border-indigo-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition-all"
          >
            <FiLogOut className="text-xl" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto mt-12">
        <header className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Your recent activities and updates</p>
        </header>

        {/* Content Container */}
        <section className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 ">
          {children}
        </section>
      </main>
    </div>
  );
}

// Reusable NavLink component
const NavLink = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all text-lg"
  >
    {icon}
    <span>{label}</span>
  </Link>
);