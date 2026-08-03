'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import api from '@/lib/api';
import { Plus, Search, Users, Phone, Mail } from 'lucide-react';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function loadBeneficiaries() {
    try {
      setLoading(true);

      const { data } = await api.get('/beneficiaries', {
        params: {
          search,
        },
      });

      setBeneficiaries(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBeneficiaries();
  }, [search]);

  return (
    <>
      <Navbar title="Beneficiaries" />

      <div className="p-8 space-y-8">

        {/* Hero */}

        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 text-white p-8 shadow-xl">

          <p className="text-white/80 text-lg">
            👨‍👩‍👧 Beneficiary Management
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Manage Beneficiaries
          </h1>

          <p className="mt-4 max-w-2xl text-white/90">
            Register, manage and monitor every beneficiary
            receiving support from the organization.
          </p>

        </div>

        {/* Search + Button */}

        <div className="flex flex-col md:flex-row justify-between gap-4">

          <div className="relative w-full md:w-96">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search beneficiaries..."
              className="w-full border rounded-xl py-3 pl-10 pr-4"
            />

          </div>

          <Link
            href="/beneficiaries/add"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 flex items-center gap-2"
          >
            <Plus size={18}/>
            Add Beneficiary
          </Link>

        </div>

        {/* Cards */}

        {loading ? (

          <div>Loading...</div>

        ) : beneficiaries.length === 0 ? (

          <div className="text-center py-20 text-gray-400">
            No beneficiaries found.
          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {beneficiaries.map((b)=>(
              <Link
                key={b.id}
                href={`/beneficiaries/${b.id}`}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
              >

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">

                    <Users className="text-green-600"/>

                  </div>

                  <div>

                    <h2 className="font-bold text-xl">
                      {b.full_name}
                    </h2>

                    <p className="text-gray-500 capitalize">
                      {b.beneficiary_type}
                    </p>

                  </div>

                </div>

                <div className="mt-6 space-y-2">

                  <div className="flex items-center gap-2 text-gray-600">

                    <Phone size={16}/>

                    {b.phone || '-'}

                  </div>

                  <div className="flex items-center gap-2 text-gray-600">

                    <Mail size={16}/>

                    {b.email || '-'}

                  </div>

                </div>

                <div className="mt-6">

                  <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                    {b.status}

                  </span>

                </div>

              </Link>
            ))}

          </div>

        )}

      </div>

    </>
  );
}