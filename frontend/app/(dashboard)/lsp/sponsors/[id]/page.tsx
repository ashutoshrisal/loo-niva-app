'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft, HandHeart } from 'lucide-react';

export default function SponsorDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const { data } = await api.get(`/sponsors/${id}`);
        setSponsor(data.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load sponsor.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const fields = sponsor
    ? [
        {
          label: 'Full Name',
          value: sponsor.full_name,
        },
        {
          label: 'Organization',
          value: sponsor.organization_name,
        },
        { label: 'Email', value: sponsor.email },
        { label: 'Phone', value: sponsor.phone },
        { label: 'Country', value: sponsor.country },
        { label: 'Address', value: sponsor.address },
        {
          label: 'Sponsor Type',
          value: sponsor.sponsor_type,
        },
        { label: 'Status', value: sponsor.status },
      ].filter((f) => f.value)
    : [];

  return (
    <>
      <Navbar title="Sponsor Details" />

      <div className="p-4 md:p-8 space-y-6">

        <Link
          href="/lsp/sponsors"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Sponsors
        </Link>

        {loading ? (
          <p className="text-gray-500">Loading sponsor...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : sponsor ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <div className="flex items-center gap-3 text-indigo-600">
              <HandHeart size={20} />
              <p className="text-sm font-semibold uppercase tracking-wider">
                Sponsor
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
{sponsor.full_name || 'Sponsor'}
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
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Sponsor not found.</p>
          </div>
        )}

      </div>
    </>
  );
}
