'use client';

import Link from 'next/link';
import { ArrowRight, Handshake } from 'lucide-react';

interface Sponsor {
  id: string;
  full_name: string;
  organization_name?: string;
  country?: string;
  email?: string;
  status: string;
}

interface Props {
  sponsors: Sponsor[];
}

export default function RecentSponsors({ sponsors }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
          Recent Sponsors
        </h2>

        <Link
          href="/lsp/sponsors"
          className="text-blue-600 flex items-center gap-2 hover:underline"
        >
          View All
          <ArrowRight size={16} />
        </Link>

      </div>

      <div className="space-y-4">

        {sponsors.length === 0 && (
          <p className="text-gray-500">
            No sponsors found.
          </p>
        )}

        {sponsors.map((sponsor) => (

          <Link
            key={sponsor.id}
            href={`/lsp/sponsors/${sponsor.id}`}
            className="flex items-center justify-between border rounded-xl p-4 hover:bg-gray-50 transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                <Handshake
                  size={22}
                  className="text-blue-600"
                />

              </div>

              <div>

                <h3 className="font-semibold">
                  {sponsor.full_name}
                </h3>

                <p className="text-sm text-gray-500">
                  {sponsor.organization_name || 'Individual Sponsor'}
                </p>

                <p className="text-sm text-gray-500">
                  {sponsor.country || '-'}
                </p>

                <p className="text-sm text-gray-500">
                  {sponsor.email || '-'}
                </p>

              </div>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                sponsor.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {sponsor.status}
            </span>

          </Link>

        ))}

      </div>

    </div>
  );
}