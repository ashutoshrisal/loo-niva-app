'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

export default function AddSchoolPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveSchool(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert('School name is required.');
      return;
    }

    setSaving(true);

    try {
      await api.post('/schools', {
        name,
      });

      alert('School added successfully.');

      router.push('/lsp/schools');
    } catch (err) {
      console.error(err);
      alert('Failed to create school.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar title="Add School" />

      <div className="max-w-2xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">
          Add School
        </h1>

        <form
          onSubmit={saveSchool}
          className="bg-white rounded-xl shadow p-8 space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              School Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter school name"
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
              {saving ? 'Saving...' : 'Save School'}
            </button>

          </div>

        </form>

      </div>
    </>
  );
}