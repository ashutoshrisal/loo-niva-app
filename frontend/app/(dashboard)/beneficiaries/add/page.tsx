'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

const TYPES = [
  'Child',
  'Youth',
  'Woman',
  'Senior Citizen',
  'Person with Disability',
  'Other',
];

export default function AddBeneficiaryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    date_of_birth: '',
    address: '',
    phone: '',
    email: '',
    beneficiary_type: 'Child',
    guardian_name: '',
    guardian_phone: '',
    notes: '',
    status: 'active',
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

  async function saveBeneficiary(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post('/beneficiaries', {
        ...form,
        date_of_birth: form.date_of_birth || null,
      });

      alert('Beneficiary added successfully.');

      router.push('/beneficiaries');

    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        'Failed to create beneficiary.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar title="Add Beneficiary" />

      <div className="max-w-6xl mx-auto p-8">

        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 text-white p-8 shadow-xl mb-8">

          <p className="text-white/80 text-lg">
            👨‍👩‍👧 Beneficiary Management
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Add New Beneficiary
          </h1>

          <p className="mt-4 text-white/90">
            Register a beneficiary into the NGO system.
          </p>

        </div>

        <form
          onSubmit={saveBeneficiary}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Full Name *
              </label>

              <input
                required
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Gender
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Date of Birth
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Beneficiary Type
              </label>

              <select
                name="beneficiary_type"
                value={form.beneficiary_type}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                {TYPES.map(type => (
                  <option key={type}>{type}</option>
                ))}
              </select>
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
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Guardian Name
              </label>

              <input
                name="guardian_name"
                value={form.guardian_name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Guardian Phone
              </label>

              <input
                name="guardian_phone"
                value={form.guardian_phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div className="flex justify-end gap-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="border px-6 py-3 rounded-xl"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
            >
              {loading ? 'Saving...' : 'Save Beneficiary'}
            </button>

          </div>

        </form>

      </div>

    </>
  );
}