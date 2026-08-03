'use client';

import Link from 'next/link';
import {
  UserPlus,
  Building2,
  Handshake,
  BadgeDollarSign,
  School,
  FileText,
  Users,
  BarChart3,
} from 'lucide-react';

const actions = [
  {
    title: 'Add Student',
    icon: UserPlus,
    href: '/lsp/students/add',
    color: 'text-blue-600',
    bg: 'hover:bg-blue-50',
  },
  {
    title: 'Add School',
    icon: School,
    href: '/lsp/schools/add',
    color: 'text-green-600',
    bg: 'hover:bg-green-50',
  },
  {
    title: 'Add Sponsor',
    icon: Handshake,
    href: '/lsp/sponsors/add',
    color: 'text-orange-600',
    bg: 'hover:bg-orange-50',
  },
  {
    title: 'Assign Sponsor',
    icon: BadgeDollarSign,
    href: '/lsp/sponsorships/add',
    color: 'text-purple-600',
    bg: 'hover:bg-purple-50',
  },
  {
    title: 'Schools',
    icon: Building2,
    href: '/lsp/schools',
    color: 'text-indigo-600',
    bg: 'hover:bg-indigo-50',
  },
  {
    title: 'Students',
    icon: Users,
    href: '/lsp/students',
    color: 'text-pink-600',
    bg: 'hover:bg-pink-50',
  },
  {
    title: 'Sponsors',
    icon: Handshake,
    href: '/lsp/sponsors',
    color: 'text-emerald-600',
    bg: 'hover:bg-emerald-50',
  },
  {
    title: 'Reports',
    icon: FileText,
    href: '/reports',
    color: 'text-red-600',
    bg: 'hover:bg-red-50',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-3xl shadow p-6">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`rounded-2xl border p-6 transition duration-300 text-center shadow-sm hover:shadow-lg ${action.bg}`}
            >
              <Icon
                size={38}
                className={`mx-auto mb-4 ${action.color}`}
              />

              <h3 className="font-semibold">
                {action.title}
              </h3>
            </Link>
          );
        })}

      </div>

    </div>
  );
}