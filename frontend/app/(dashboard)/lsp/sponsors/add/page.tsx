'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AddSponsorPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    organization: '',
    address: '',
    remarks: '',
    status: 'active',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveSponsor(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post('/sponsors', form);

      alert('Sponsor added successfully.');

      router.push('/lsp/sponsors');
    } catch (err) {
      console.error(err);
      alert('Failed to add sponsor.');
    } finally {
      setLoading(false);
    }
  }
        return (
      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">
          Add Sponsor
        </h1>

        <form
          onSubmit={saveSponsor}
          className="bg-white shadow rounded-2xl p-8 space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Full Name *
            </label>

            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block mb-2 font-medium">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Organization
              </label>

              <input
                type="text"
                name="organization"
                value={form.organization}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

          </div>

          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              rows={3}
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Remarks
            </label>

            <textarea
              rows={3}
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
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
              className="w-full border rounded-lg p-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              {loading ? 'Saving...' : 'Save Sponsor'}
            </button>

          </div>

        </form>

      </div>
    );
}