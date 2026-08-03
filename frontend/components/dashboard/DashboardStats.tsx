'use client';

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
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

      <StatCard
        label="Students"
        value={summary.totalStudents}
        icon={GraduationCap}
      />

      <StatCard
        label="Schools"
        value={summary.totalSchools}
        icon={School}
        accent="green"
      />

      <StatCard
        label="Sponsors"
        value={summary.totalSponsors}
        icon={Handshake}
      />

      <StatCard
        label="Sponsorships"
        value={summary.totalSponsorships}
        icon={HeartHandshake}
        accent="green"
      />

      <StatCard
        label="Active Students"
        value={summary.activeStudents}
        icon={GraduationCap}
      />

    </div>
  );
}