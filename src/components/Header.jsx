"use client";

import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  TicketIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Dropdown items
  const services = [
    { name: 'Personal Charter', href: '/personal-charter' },
    { name: 'Hire Charter', href: '/hire-charter' },
    { name: 'Business Class', href: '/business-class-charter' },
    { name: 'Helicopter Hire', href: '/helicopter-hire' },
    { name: 'Marriage', href: '/hire-for-marriage' },
  ];
  const downloads = [
    { name: 'Ticket', href: '/get-ticket' },
    { name: 'Schedule', href: '/schedule-final.pdf', download: true },
  ];

  // User menu
  const userMenuItems = [
    { name: 'Profile', href: '/user-dashboard', icon: ChevronDownIcon },
    { name: 'My Bookings', href: '/user-dashboard/bookings', icon: TicketIcon },
    { name: 'Settings', href: '', icon: Cog6ToothIcon },
  ];
  const adminMenuItems = [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: ChartBarIcon },
    { name: 'Manage Flights', href: '/admin-dashboard/add-flight', icon: PaperAirplaneIcon },
    { name: 'Joy Ride Management', href: '/admin-dashboard/all-joyride-slots', icon: SparklesIcon },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header
      className={`fixed w-full py-2 top-0 z-50 transition duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow border-b border-slate-200'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-auto">
            <img src="/logoo-04.png" alt="Logo" className="h-8 w-40" />
          </Link>

          {/* Main nav: total 5 items */}
          <div className="hidden md:flex items-center space-x-6">
            {/* 1. Services dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                Services
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </Menu.Button>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Menu.Items className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-slate-200">
                  {services.map(item => (
                    <Menu.Item key={item.href}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          className={`${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'} block px-4 py-2 text-sm`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            {/* 2. Hire Charter */}
            <Link
              href="/hire-charter"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/hire-charter') ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Hire Charter
            </Link>

            {/* 3. Business Class */}
            <Link
              href="/business-class-charter"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/business-class-charter') ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Business Class
            </Link>

            {/* 4. Helicopter Hire */}
            <Link
              href="/helicopter-hire"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/helicopter-hire') ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Helicopter Hire
            </Link>

            {/* 5. Download dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                Download
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </Menu.Button>
              <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Menu.Items className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-slate-200">
                  {downloads.map(item => (
                    <Menu.Item key={item.href}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          download={item.download}
                          className={`${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'} block px-4 py-2 text-sm`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* User menu / Auth */}
          <div className="hidden md:flex items-center ml-auto space-x-4">
            {authState.isLoggedIn ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                  <UserCircleIcon className="w-7 h-7" />

                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 border border-slate-200">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-slate-100">

                        <p className="text-xs text-slate-500">
                          {authState.userRole === '1' ? 'Administrator' : authState.userRole === '2' ? 'Agent' : 'Customer'}
                        </p>
                      </div>
                      {(authState.userRole === '1' || authState.userRole === 1) && adminMenuItems.map(item => (
                        <Menu.Item key={item.href}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={`${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'} flex items-center px-3 py-2 text-sm rounded-lg`}
                            >
                              <item.icon className="w-4 h-4 mr-2" />{item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      {userMenuItems.map(item => (
                        <Menu.Item key={item.href}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={`${active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'} flex items-center px-3 py-2 text-sm rounded-lg`}
                            >
                              <item.icon className="w-4 h-4 mr-2" />{item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      <div className="border-t border-slate-100 my-2" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`flex w-full items-center px-3 py-2 text-sm rounded-lg ${
                              active ? 'bg-red-50 text-red-700' : 'text-slate-700'
                            }`}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-slate-600 hover:text-blue-600">Sign In</Link>
                <Link href="/sign-up" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden ml-auto">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition">
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition show={mobileMenuOpen} enter="transition ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <div className="md:hidden bg-white border-t border-slate-200 shadow-lg rounded-b-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Services */}
              <Menu as="div" className="relative">
                <Menu.Button className="w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  Services
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Menu.Items className="mt-1 space-y-1">
                    {services.map(item => (
                      <Menu.Item key={item.href}>
                        {({ active }) => (
                          <Link href={item.href} className={`${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'} block px-5 py-2 text-base rounded-lg`}> {item.name}</Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* Links */}
              {['/hire-charter', '/business-class-charter', '/helicopter-hire'].map(href => (
                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 text-base font-medium rounded-lg ${isActive(href) ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>{
                  href === '/hire-charter' ? 'Hire Charter' : href === '/business-class-charter' ? 'Business Class' : 'Helicopter Hire'
                }</Link>
              ))}
              {/* Download */}
              <Menu as="div" className="relative">
                <Menu.Button className="w-full text-left px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  Download
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Menu.Items className="mt-1 space-y-1">
                    {downloads.map(item => (
                      <Menu.Item key={item.href}>
                        {({ active }) => (
                          <Link href={item.href} download={item.download} onClick={() => setMobileMenuOpen(false)} className={`${active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'} block px-5 py-2 text-base rounded-lg`}>{item.name}</Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <div className="border-t border-slate-200 pt-3 pb-4">
              {authState.isLoggedIn ? (
                <div className="space-y-1">
                  <div className="px-3 py-2">

                    <p className="text-sm text-slate-500">{authState.userRole === '1' ? 'Admin' : authState.userRole === '2' ? 'Agent' : 'Customer'}</p>
                  </div>
                  {(authState.userRole === '1' || authState.userRole === 1) && adminMenuItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <item.icon className="w-5 h-5 mr-3" />{item.name}
                    </Link>
                  ))}
                  {userMenuItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                      <item.icon className="w-5 h-5 mr-3" />{item.name}
                    </Link>
                  ))}
                  <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-3 space-y-2">
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">Sign In</Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </nav>
    </header>
  );
};

export default Header;
