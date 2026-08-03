'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';

export default function AddActivityPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    project_id: '',
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
    const loadProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      await api.post('/activities', {
        ...form,
        budget: Number(form.budget) || 0,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        activity_date: form.activity_date || null,
      });

      router.push('/activities');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to create activity.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar title="Add Activity" />

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
            Record Activity
          </h1>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              className="input-field"
              value={form.project_id}
              onChange={(e) =>
                setForm({ ...form, project_id: e.target.value })
              }
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              required
              className="input-field"
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
              <option value="meeting">Meeting</option>
              <option value="awareness">Awareness</option>
              <option value="field_visit">Field Visit</option>
              <option value="distribution">Distribution</option>
              <option value="monitoring">Monitoring</option>
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
                setForm({ ...form, description: e.target.value })
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
                Date *
              </label>
              <input
                required
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
                  setForm({ ...form, end_time: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Budget (NPR)
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
              disabled={submitting || loadingProjects}
              className="btn-primary"
            >
              {submitting ? 'Saving...' : 'Save Activity'}
            </button>
          </div>

        </form>

      </div>
    </>
  );
}
