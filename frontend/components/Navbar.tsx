'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

export default function Navbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const { openMobile } = useSidebar();

  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New report submitted',
      time: '2 min ago',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Project updated',
      time: '15 min ago',
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'New beneficiary added',
      time: '1 hour ago',
      color: 'bg-orange-500',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
<div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6">

        {/* Left */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">

          <button
            onClick={openMobile}
            className="md:hidden shrink-0 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <img
            src="/logo.jpg"
            alt="Loo Niva"
            className="hidden xs:block h-8 w-8 md:h-10 md:w-10 rounded-xl object-contain shrink-0"
          />

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-2xl font-bold text-slate-800 dark:text-white truncate">
              {title || 'Dashboard'}
            </h1>

            <p className="hidden sm:block text-xs md:text-sm text-gray-500 truncate">
              Welcome back 👋
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 justify-center px-10">

          <div className="relative w-full max-w-lg">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search projects, reports, beneficiaries..."
              className="w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

          </div>

        </div>

{/* Right */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0">

          {/* Notifications */}
          <div className="relative">

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:scale-105 transition"
            >
              <Bell size={20} />

              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden">

                <div className="px-5 py-4 border-b font-semibold">
                  Notifications
                </div>

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                  >

                    <div className={`w-3 h-3 rounded-full mt-2 ${n.color}`} />

                    <div className="flex-1">

                      <p className="font-medium">
                        {n.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {n.time}
                      </p>

                    </div>

                  </div>
                ))}

                <Link
                  href="/reports"
                  className="block text-center py-3 text-blue-600 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  View All
                </Link>

              </div>
            )}

          </div>

          {/* Dark Mode Button */}
          <button className="hidden md:flex p-3 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:rotate-12 transition">

            <Moon size={20} />

          </button>

          {/* User */}
          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >

              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-700 to-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0) || '?'}
              </div>

              <div className="hidden md:block text-left">

                <p className="font-semibold text-slate-800 dark:text-white">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>

              </div>

              <ChevronDown size={18} />

            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                >

                  <LogOut size={18} />

                  Sign Out

                </button>

              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
}