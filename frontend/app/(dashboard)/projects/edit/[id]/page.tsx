'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

const CATEGORIES = [
  'education',
  'participation',
  'advocacy',
  'protection',
  'health',
  'livelihood',
  'emergency',
  'other',
];

const STATUSES = [
  'planned',
  'active',
  'on_hold',
  'completed',
  'cancelled',
];

export default function EditProjectPage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'education',
    description: '',
    target_location: '',
    funding_source: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'planned',
  });

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {

    try {

      const res = await api.get(`/projects/${id}`);

      const p = res.data.data;

      setForm({
        title: p.title || '',
        category: p.category || 'education',
        description: p.description || '',
        target_location: p.target_location || '',
        funding_source: p.funding_source || '',
        budget: String(p.budget || ''),
        start_date: p.start_date?.substring(0,10) || '',
        end_date: p.end_date?.substring(0,10) || '',
        status: p.status || 'planned',
      });

    } catch (err) {

      console.error(err);

      alert('Failed to load project.');

    } finally {

      setLoading(false);

    }

  }

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

  async function updateProject(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setSaving(true);

      await api.put(`/projects/${id}`, {
        ...form,
        budget: Number(form.budget) || 0,
      });

      alert('Project updated successfully.');

      router.push(`/projects/${id}`);

    } catch (err) {

      console.error(err);

      alert('Failed to update project.');

    } finally {

      setSaving(false);

    }

  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Edit Project" />

      <div className="max-w-6xl mx-auto p-8">

        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 text-white p-8 shadow-xl mb-8">

          <p className="text-white/80">
            Project Management
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Edit Project
          </h1>

          <p className="mt-4 text-white/90">
            Update project information and save your changes.
          </p>

        </div>

        <form
          onSubmit={updateProject}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >
            <div className="grid md:grid-cols-2 gap-6">

  <div>

    <label className="block font-medium mb-2">
      Project Title
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

    <label className="block font-medium mb-2">
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

  <label className="block font-medium mb-2">
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

    <label className="block font-medium mb-2">
      Target Location
    </label>

    <input
      type="text"
      name="target_location"
      value={form.target_location}
      onChange={handleChange}
      className="w-full border rounded-xl p-3"
    />

  </div>

  <div>

    <label className="block font-medium mb-2">
      Funding Source
    </label>

    <input
      type="text"
      name="funding_source"
      value={form.funding_source}
      onChange={handleChange}
      className="w-full border rounded-xl p-3"
    />

  </div>

</div>

<div className="grid md:grid-cols-2 gap-6">

  <div>

    <label className="block font-medium mb-2">
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

    <label className="block font-medium mb-2">
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

    <label className="block font-medium mb-2">
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

    <label className="block font-medium mb-2">
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

<div className="flex justify-end gap-4 pt-6">

  <button
    type="button"
    onClick={() => router.back()}
    className="px-6 py-3 border rounded-xl hover:bg-gray-100"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={saving}
    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold"
  >
    {saving ? 'Updating...' : 'Update Project'}
  </button>

</div>
            
        
        
                </form>

      </div>

    </>

  );

}