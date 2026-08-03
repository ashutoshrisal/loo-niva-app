'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

export default function EditSponsorPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    organization: '',
    address: '',
    status: 'active',
  });

  useEffect(() => {
    loadSponsor();
  }, []);

  async function loadSponsor() {
    try {
      const res = await api.get(`/sponsors/${id}`);

      const sponsor = res.data.data;

      setForm({
        full_name: sponsor.full_name || '',
        email: sponsor.email || '',
        phone: sponsor.phone || '',
        country: sponsor.country || '',
        organization: sponsor.organization_name || '',
        address: sponsor.address || '',
        status: sponsor.status || 'active',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load sponsor.');
    } finally {
      setPageLoading(false);
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

  async function updateSponsor(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/sponsors/${id}`, form);

      alert('Sponsor updated successfully.');

      router.push('/lsp/sponsors');
    } catch (err) {
      console.error(err);
      alert('Failed to update sponsor.');
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Sponsor
      </h1>

      <form
        onSubmit={updateSponsor}
        className="bg-white shadow rounded-2xl p-8 space-y-5"
      >

        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded-lg p-3"
          required
        />

        <div className="grid md:grid-cols-2 gap-5">

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-lg p-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-lg p-3"
          />

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="border rounded-lg p-3"
          />

          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Organization"
            className="border rounded-lg p-3"
          />

        </div>

        <textarea
          rows={4}
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border rounded-lg p-3"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
            {loading ? 'Updating...' : 'Update Sponsor'}
          </button>

        </div>

      </form>

    </div>
  );
}