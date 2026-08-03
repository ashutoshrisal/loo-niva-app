'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Sponsor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  status: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSponsors();
  }, []);

  async function loadSponsors() {
    try {
      const res = await api.get('/sponsors');
      setSponsors(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load sponsors.');
    }
  }

  async function deleteSponsor(id: string) {
    const confirmed = window.confirm(
      'Delete this sponsor?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/sponsors/${id}`);

      loadSponsors();

      alert('Sponsor deleted.');
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  }

  const filtered = sponsors.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Sponsors
          </h1>

          <p className="text-gray-500 mt-2">
            Manage NGO Sponsors
          </p>

        </div>

        <Link
          href="/lsp/sponsors/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          + Add Sponsor
        </Link>

      </div>

      <div className="bg-white rounded-2xl shadow border p-5 mb-6">

        <input
          placeholder="Search sponsor..."
          className="w-full border rounded-lg p-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Name</th>
              <th className="text-left">Organization</th>
              <th className="text-left">Country</th>
              <th className="text-left">Email</th>
              <th className="text-left">Phone</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((sponsor) => (

              <tr
                key={sponsor.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {sponsor.full_name}
                </td>

                <td>
                  {sponsor.organization || '-'}
                </td>

                <td>
                  {sponsor.country || '-'}
                </td>

                <td>
                  {sponsor.email || '-'}
                </td>

                <td>
                  {sponsor.phone || '-'}
                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sponsor.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {sponsor.status}
                  </span>

                </td>

                <td className="space-x-3">

                  <Link
                    href={`/lsp/sponsors/${sponsor.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/lsp/sponsors/edit/${sponsor.id}`}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteSponsor(sponsor.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}