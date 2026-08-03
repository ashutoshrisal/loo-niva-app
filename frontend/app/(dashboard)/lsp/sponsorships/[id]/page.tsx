'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft, HandHeart } from 'lucide-react';

export default function SponsorshipDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [sponsorship, setSponsorship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const { data } = await api.get(`/sponsorships/${id}`);
        setSponsorship(data.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load sponsorship.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const fields = sponsorship
    ? [
        { label: 'Student ID', value: sponsorship.student_id },
        { label: 'Sponsor ID', value: sponsorship.sponsor_id },
        {
          label: 'Monthly Amount',
          value: sponsorship.monthly_amount
            ? `Rs. ${Number(
                sponsorship.monthly_amount
              ).toLocaleString()}`
            : '',
        },
        {
          label: 'Start Date',
          value: sponsorship.sponsorship_start,
        },
        {
          label: 'End Date',
          value: sponsorship.sponsorship_end,
        },
        { label: 'Status', value: sponsorship.status },
      ].filter((f) => f.value)
    : [];

  return (
    <>
      <Navbar title="Sponsorship Details" />

      <div className="p-4 md:p-8 space-y-6">

        <Link
          href="/lsp/sponsorships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Sponsorships
        </Link>

        {loading ? (
          <p className="text-gray-500">Loading sponsorship...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : sponsorship ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <div className="flex items-center gap-3 text-indigo-600">
              <HandHeart size={20} />
              <p className="text-sm font-semibold uppercase tracking-wider">
                Sponsorship
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              Sponsorship Details
            </h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.label}>
                  <p className="text-sm text-gray-500">{f.label}</p>
                  <p className="font-semibold break-words">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href={`/lsp/sponsorships/edit/${id}`}
                className="btn-primary"
              >
                Edit Sponsorship
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              Sponsorship not found.
            </p>
          </div>
        )}

      </div>
    </>
  );
}
