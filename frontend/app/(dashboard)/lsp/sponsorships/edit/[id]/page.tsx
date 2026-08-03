'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
}

interface Sponsor {
  id: string;
  full_name: string;
}

export default function EditSponsorshipPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [students, setStudents] = useState<Student[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    student_id: '',
    sponsor_id: '',
    monthly_amount: '',
    sponsorship_start: '',
    sponsorship_end: '',
    status: 'active',
  });

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const [studentRes, sponsorRes, itemRes] =
          await Promise.all([
            api.get('/students'),
            api.get('/sponsors'),
            api.get(`/sponsorships/${id}`),
          ]);

        setStudents(studentRes.data.data);
        setSponsors(sponsorRes.data.data);

        const s = itemRes.data.data;
        setForm({
          student_id: s.student_id || '',
          sponsor_id: s.sponsor_id || '',
          monthly_amount:
            s.monthly_amount != null
              ? String(s.monthly_amount)
              : '',
          sponsorship_start: s.sponsorship_start || '',
          sponsorship_end: s.sponsorship_end || '',
          status: s.status || 'active',
        });
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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      await api.put(`/sponsorships/${id}`, form);

      router.push(`/lsp/sponsorships/${id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to update sponsorship.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar title="Edit Sponsorship" />
        <p className="p-10 text-center text-gray-500">
          Loading sponsorship...
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar title="Edit Sponsorship" />

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">

        <Link
          href="/lsp/sponsorships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Sponsorships
        </Link>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={save}
          className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md space-y-5"
        >

          <h1 className="text-2xl font-bold text-gray-900">
            Edit Sponsorship
          </h1>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Student
            </label>
            <select
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Sponsor
            </label>
            <select
              name="sponsor_id"
              value={form.sponsor_id}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Sponsor</option>
              {sponsors.map((sponsor) => (
                <option
                  key={sponsor.id}
                  value={sponsor.id}
                >
                  {sponsor.full_name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="number"
            step="0.01"
            name="monthly_amount"
            placeholder="Monthly Amount"
            value={form.monthly_amount}
            onChange={handleChange}
            className="input-field"
          />

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="sponsorship_start"
                value={form.sponsorship_start}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="sponsorship_end"
                value={form.sponsorship_end}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex justify-end gap-4 pt-2">
            <Link
              href="/lsp/sponsorships"
              className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>

      </div>
    </>
  );
}
