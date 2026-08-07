'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

const CATEGORIES = [
  'education',
  'child_protection',
  'health',
  'livelihood',
  'advocacy',
  'emergency',
  'other',
];

const STATUSES = [
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled',
];

export default function AddProjectPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
  project_code: '',
  title: '',
  category: 'education',
  description: '',
  donor_name: '',
  budget: '',
  start_date: '',
  end_date: '',
  status: 'planning',
});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveProject(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post('/projects', {
  project_code: form.project_code,
  title: form.title,
  category: form.category,
  description: form.description,
  donor_name: form.donor_name,
  budget: Number(form.budget) || 0,
  start_date: form.start_date || null,
  end_date: form.end_date || null,
  status: form.status,
});

      alert('Project created successfully.');

      router.push('/projects');

    }catch (err: any) {
  console.error(err);

  console.log(err.response?.data);

  alert(
    err.response?.data?.message ||
    JSON.stringify(err.response?.data) ||
    "Failed to create project."
  );
}finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar title="Add Project" />

<div className="max-w-6xl mx-auto p-8">

        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-8 shadow-xl mb-8">

          <p className="text-white/80 text-lg">
            📂 Project Management
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Create New Project
          </h1>

          <p className="mt-4 max-w-2xl text-white/90">
            Register a new NGO project and begin tracking
            budgets, activities, beneficiaries and progress.
          </p>

        </div>

        <form
          onSubmit={saveProject}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Project Title *
              </label>

              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Program Area
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-6">

  <div>

    <label className="block mb-2 font-medium">
      Project Code *
    </label>

    <input
      type="text"
      name="project_code"
      required
      value={form.project_code}
      onChange={handleChange}
      className="w-full border rounded-xl p-3"
      placeholder="PRJ-001"
    />

  </div>

  <div>

    <label className="block mb-2 font-medium">
      Donor Name
    </label>

    <input
      type="text"
      name="donor_name"
      value={form.donor_name}
      onChange={handleChange}
      className="w-full border rounded-xl p-3"
      placeholder="UNICEF"
    />

  </div>

</div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-medium">
                Budget (NPR)
              </label>

              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-medium">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />

            </div>

          </div>
<div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              {loading ? 'Creating Project...' : 'Create Project'}
            </button>

          </div>

        </form>

      </div>

    </>
  );
}
