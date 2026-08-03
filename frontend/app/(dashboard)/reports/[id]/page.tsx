'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import api from '@/lib/api';

export default function BeneficiaryDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBeneficiary();
  }, []);

  async function loadBeneficiary() {
    try {
      const { data } = await api.get(`/beneficiaries/${id}`);
      setBeneficiary(data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load beneficiary.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteBeneficiary() {
    if (!confirm('Delete this beneficiary?')) return;

    try {
      await api.delete(`/beneficiaries/${id}`);
      alert('Beneficiary deleted.');
      router.push('/beneficiaries');
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  }

  if (loading) {
    return (
      <>
        <Navbar title="Beneficiary" />
        <div className="p-8">Loading...</div>
      </>
    );
  }

  if (!beneficiary) {
    return (
      <>
        <Navbar title="Beneficiary" />
        <div className="p-8">Beneficiary not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar title={beneficiary.full_name} />

      <div className="max-w-5xl mx-auto p-8">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h1 className="text-4xl font-bold">
            {beneficiary.full_name}
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div>
              <strong>Gender</strong>
              <p>{beneficiary.gender || '-'}</p>
            </div>

            <div>
              <strong>Beneficiary Type</strong>
              <p>{beneficiary.beneficiary_type || '-'}</p>
            </div>

            <div>
              <strong>Phone</strong>
              <p>{beneficiary.phone || '-'}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{beneficiary.email || '-'}</p>
            </div>

            <div>
              <strong>Guardian</strong>
              <p>{beneficiary.guardian_name || '-'}</p>
            </div>

            <div>
              <strong>Guardian Phone</strong>
              <p>{beneficiary.guardian_phone || '-'}</p>
            </div>

            <div className="md:col-span-2">
              <strong>Address</strong>
              <p>{beneficiary.address || '-'}</p>
            </div>

            <div className="md:col-span-2">
              <strong>Notes</strong>
              <p>{beneficiary.notes || '-'}</p>
            </div>

          </div>

          <div className="flex gap-4 mt-10">

            <Link
              href={`/beneficiaries/edit/${beneficiary.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Edit
            </Link>

            <button
              onClick={deleteBeneficiary}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    </>
  );
}