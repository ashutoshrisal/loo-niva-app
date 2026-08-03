'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Sponsorship {
  id: string;
  student_name: string;
  sponsor_name: string;
  monthly_amount: number;
  sponsorship_start: string;
  sponsorship_end: string;
  status: string;
}

export default function SponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);

  useEffect(() => {
    loadSponsorships();
  }, []);

  async function loadSponsorships() {
    try {
      const res = await api.get('/sponsorships');
      setSponsorships(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load sponsorships.');
    }
  }

  async function deleteSponsorship(id: string) {
    if (!confirm('Delete this sponsorship?')) return;

    try {
      await api.delete(`/sponsorships/${id}`);
      loadSponsorships();
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Sponsorships
          </h1>

          <p className="text-gray-500">
            Manage Student Sponsorships
          </p>
        </div>

        <Link
          href="/lsp/sponsorships/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
        >
          + Add Sponsorship
        </Link>

      </div>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">Student</th>
              <th className="text-left">Sponsor</th>
              <th className="text-left">Monthly Amount</th>
              <th className="text-left">Start Date</th>
              <th className="text-left">End Date</th>
              <th className="text-left">Status</th>
              <th className="text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {sponsorships.map((item) => (

              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">{item.student_name}</td>

                <td>{item.sponsor_name}</td>

                <td>
                  Rs. {Number(item.monthly_amount).toLocaleString()}
                </td>

                <td>{item.sponsorship_start}</td>

                <td>{item.sponsorship_end}</td>

                <td>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    {item.status}
                  </span>

                </td>

                <td className="space-x-3">

                  <Link
                    href={`/lsp/sponsorships/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/lsp/sponsorships/edit/${item.id}`}
                    className="text-green-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteSponsorship(item.id)}
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