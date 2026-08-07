'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { GraduationCap } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ClipboardList,
  FileText,
  Image as GalleryIcon,
  FolderOpen,
  Calendar,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'project_manager', 'field_staff', 'viewer'] },
  { href: '/projects', label: 'Projects', icon: FolderKanban, roles: ['super_admin', 'project_manager', 'field_staff', 'viewer'] },
  { href: '/activities', label: 'Activities', icon: ClipboardList, roles: ['super_admin', 'project_manager', 'field_staff'] },
  { href: '/beneficiaries', label: 'Beneficiaries', icon: Users, roles: ['super_admin', 'project_manager', 'field_staff'] },
  {
    href: '/lsp',
    label: 'LSP',
    icon: GraduationCap,
    roles: ['super_admin', 'project_manager', 'field_staff']
  },
  { href: '/reports', label: 'Reports', icon: FileText, roles: ['super_admin', 'project_manager', 'field_staff'] },
  { href: '/dashboard/gallery', label: 'Gallery', icon: GalleryIcon, roles: ['super_admin', 'project_manager', 'field_staff', 'viewer'] },
  { href: '/documents', label: 'Documents', icon: FolderOpen, roles: ['super_admin', 'project_manager'] },
  { href: '/calendar', label: 'Calendar', icon: Calendar, roles: ['super_admin', 'project_manager', 'field_staff'] },
  { href: '/users', label: 'User Management', icon: Users, roles: ['super_admin'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['super_admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { mobileOpen, closeMobile } = useSidebar();

  const items = NAV_ITEMS.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  // Close the mobile drawer when the route changes (nav click already closes,
  // but this also handles browser back/forward while the drawer is open).
  useEffect(() => {
    closeMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close the drawer on Escape key press.
  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMobile();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, closeMobile]);

return (
    <>
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen sticky top-0">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
          <Image
            src="/logo.jpg"
            alt="Loo Niva Logo"
            width={48}
            height={48}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div>
          <p className="font-bold text-brand-blue dark:text-white leading-tight text-lg">
            Loo Niva
          </p>
          <p className="text-xs text-gray-400">
            Management System
          </p>
        </div>
      </div>

      
      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

{/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
        © {new Date().getFullYear()} Loo Niva Child Concern Group
      </div>
    </aside>

    {/* Mobile slide-in drawer (hidden on md and up — desktop keeps its own sidebar) */}
    <div
      className={`md:hidden fixed inset-0 z-50 ${mobileOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!mobileOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeMobile}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        className={`absolute inset-y-0 left-0 w-64 flex flex-col bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo + close */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200">
              <Image
                src="/logo.jpg"
                alt="Loo Niva Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div>
              <p className="font-bold text-brand-blue dark:text-white leading-tight text-lg">
                Loo Niva
              </p>
              <p className="text-xs text-gray-400">
                Management System
              </p>
            </div>
          </div>

          <button
            onClick={closeMobile}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(href + '/');

            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
          © {new Date().getFullYear()} Loo Niva Child Concern Group
        </div>
</aside>
    </div>
    </>
  );

}
