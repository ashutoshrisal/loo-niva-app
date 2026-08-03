'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditBeneficiaryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    date_of_birth: '',
    address: '',
    phone: '',
    email: '',
    beneficiary_type: '',
    guardian_name: '',
    guardian_phone: '',
    notes: '',
    status: 'active',
  });

  useEffect(() => {
    loadBeneficiary();
  }, []);

  async function loadBeneficiary() {
    try {
      const { data } = await api.get(`/beneficiaries/${id}`);

      const b = data.data;

      setForm({
        full_name: b.full_name || '',
        gender: b.gender || '',
        date_of_birth: b.date_of_birth
          ? b.date_of_birth.substring(0, 10)
          : '',
        address: b.address || '',
        phone: b.phone || '',
        email: b.email || '',
        beneficiary_type: b.beneficiary_type || '',
        guardian_name: b.guardian_name || '',
        guardian_phone: b.guardian_phone || '',
        notes: b.notes || '',
        status: b.status || 'active',
      });

    } catch (err) {
      console.error(err);
      alert('Failed to load beneficiary.');
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

  async function updateBeneficiary(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(`/beneficiaries/${id}`, {
        ...form,
        date_of_birth: form.date_of_birth || null,
      });

      alert('Beneficiary updated successfully.');

      router.push(`/beneficiaries/${id}`);

    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        'Update failed.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar title="Edit Beneficiary" />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Edit Beneficiary" />

      <div className="max-w-6xl mx-auto p-8">

        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white p-8 shadow-xl mb-8">

          <h1 className="text-4xl font-bold">
            Edit Beneficiary
          </h1>

          <p className="mt-3 text-white/90">
            Update beneficiary information.
          </p>

        </div>

        <form
          onSubmit={updateBeneficiary}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-medium block mb-2">
                Full Name
              </label>

              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div>
              <label className="font-medium block mb-2">
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
              <label className="font-medium block mb-2">
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
              <label className="font-medium block mb-2">
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
            <label className="font-medium block mb-2">
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
              <label className="font-medium block mb-2">
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
              <label className="font-medium block mb-2">
                Email
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-medium block mb-2">
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
              <label className="font-medium block mb-2">
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
            <label className="font-medium block mb-2">
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

          <div>
            <label className="font-medium block mb-2">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              {saving ? 'Updating...' : 'Update Beneficiary'}
            </button>

          </div>

        </form>

      </div>
    </>
  );
}