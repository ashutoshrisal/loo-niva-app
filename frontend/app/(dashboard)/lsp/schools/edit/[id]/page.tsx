'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSchool();
  }, []);

  async function loadSchool() {
    try {
      const res = await api.get(`/schools/${id}`);
      setName(res.data.data.name);
    } catch (err) {
      console.error(err);
      alert('Failed to load school.');
    } finally {
      setLoading(false);
    }
  }

  async function updateSchool(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert('School name is required.');
      return;
    }

    setSaving(true);

    try {
      await api.put(`/schools/${id}`, {
        name,
      });

      alert('School updated successfully.');

      router.push('/lsp/schools');
    } catch (err) {
      console.error(err);
      alert('Failed to update school.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar title="Edit School" />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Edit School" />

      <div className="max-w-2xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit School
        </h1>

        <form
          onSubmit={updateSchool}
          className="bg-white rounded-xl shadow p-8 space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              School Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

          </div>

        </form>

      </div>
    </>
  );
}