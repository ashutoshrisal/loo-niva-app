'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    activity_type: 'training',
    description: '',
    venue: '',
    activity_date: '',
    start_time: '',
    end_time: '',
    budget: '',
  });

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const { data } = await api.get(`/activities/${id}`);
        const a = data.data;
        setForm({
          title: a.title || '',
          activity_type: a.activity_type || 'training',
          description: a.description || '',
          venue: a.venue || '',
          activity_date: a.activity_date
            ? a.activity_date.slice(0, 10)
            : '',
          start_time: a.start_time || '',
          end_time: a.end_time || '',
          budget: a.budget != null ? String(a.budget) : '',
        });
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load activity.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      await api.put(`/activities/${id}`, {
        ...form,
        budget: Number(form.budget) || 0,
      });

      router.push(`/activities/${id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to update activity.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar title="Edit Activity" />
        <p className="p-10 text-center text-gray-500">
          Loading activity...
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar title="Edit Activity" />

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">

        <Link
          href="/activities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Activities
        </Link>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md space-y-5"
        >

          <h1 className="text-2xl font-bold text-gray-900">
            Edit Activity
          </h1>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              className="input-field"
              required
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Activity Type
            </label>
            <select
              className="input-field"
              value={form.activity_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  activity_type: e.target.value,
                })
              }
            >
              <option value="training">Training</option>
              <option value="workshop">Workshop</option>
              <option value="meeting">Meeting</option>
              <option value="field_visit">Field Visit</option>
              <option value="awareness">Awareness</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="input-field resize-none"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Venue
            </label>
            <input
              className="input-field"
              value={form.venue}
              onChange={(e) =>
                setForm({ ...form, venue: e.target.value })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                className="input-field"
                value={form.activity_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activity_date: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                className="input-field"
                value={form.start_time}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_time: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                className="input-field"
                value={form.end_time}
                onChange={(e) =>
                  setForm({
                    ...form,
                    end_time: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Budget (Rs.)
            </label>
            <input
              type="number"
              className="input-field"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/activities"
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
