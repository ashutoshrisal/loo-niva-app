'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Student {
  id: string;
  full_name: string;
}

interface Sponsor {
  id: string;
  full_name: string;
}

export default function AddSponsorshipPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    student_id: '',
    sponsor_id: '',
    monthly_amount: '',
    sponsorship_start: '',
    sponsorship_end: '',
    status: 'active',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [studentRes, sponsorRes] = await Promise.all([
        api.get('/students'),
        api.get('/sponsors'),
      ]);

      setStudents(studentRes.data.data);
      setSponsors(sponsorRes.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load students or sponsors.');
    }
  }

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
      setLoading(true);

      await api.post('/sponsorships', form);

      alert('Sponsorship created successfully.');

      router.push('/lsp/sponsorships');

    } catch (err) {
      console.error(err);
      alert('Failed to create sponsorship.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Sponsorship
      </h1>

      <form
        onSubmit={save}
        className="bg-white rounded-2xl shadow p-8 space-y-5"
      >

        <div>

          <label className="block mb-2 font-medium">
            Student
          </label>

          <select
            name="student_id"
            value={form.student_id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
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

          <label className="block mb-2 font-medium">
            Sponsor
          </label>

          <select
            name="sponsor_id"
            value={form.sponsor_id}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
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
          className="w-full border rounded-lg p-3"
        />

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2">
              Start Date
            </label>

            <input
              type="date"
              name="sponsorship_start"
              value={form.sponsorship_start}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2">
              End Date
            </label>

            <input
              type="date"
              name="sponsorship_end"
              value={form.sponsorship_end}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

          </div>

        </div>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex justify-end gap-4">

          <button
            type="button"
            onClick={() => router.back()}
            className="border px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? 'Saving...' : 'Save Sponsorship'}
          </button>

        </div>

      </form>

    </div>
  );
}