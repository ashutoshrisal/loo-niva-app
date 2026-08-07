'use client';

import Link from 'next/link';
import StatCard from '@/components/StatCard';
import {
  GraduationCap,
  School,
  Handshake,
  HeartHandshake,
} from 'lucide-react';

interface Summary {
  totalStudents: number;
  totalSchools: number;
  totalSponsors: number;
  totalSponsorships: number;
  activeStudents: number;
}

interface Props {
  summary: Summary;
}

export default function DashboardStats({ summary }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2">

      <Link href="/lsp?section=students" className="block">
        <StatCard
          label="Students"
          value={summary.totalStudents}
          icon={GraduationCap}
        />
      </Link>

      <Link href="/lsp?section=schools" className="block">
        <StatCard
          label="Schools"
          value={summary.totalSchools}
          icon={School}
          accent="green"
        />
      </Link>

      <Link href="/lsp?section=sponsors" className="block">
        <StatCard
          label="Sponsors"
          value={summary.totalSponsors}
          icon={Handshake}
        />
      </Link>

      <Link href="/lsp?section=sponsorships" className="block">
        <StatCard
          label="Sponsorships"
          value={summary.totalSponsorships}
          icon={HeartHandshake}
          accent="green"
        />
      </Link>

      <Link
        href="/lsp?section=active-students"
        className="block md:col-span-2 md:flex md:justify-center"
      >
        <StatCard
          label="Active Students"
          value={summary.activeStudents}
          icon={GraduationCap}
        />
      </Link>

    </div>
  );
}
