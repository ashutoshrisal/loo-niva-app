'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { ArrowLeft, School } from 'lucide-react';

interface SchoolDetail {
  id: string;
  name: string;
  address: string | null;
  municipality: string | null;
  district: string | null;
  province: string | null;
  principal_name: string | null;
  phone: string | null;
  email: string | null;
  established_year: number | null;
  is_active: boolean | null;
}

export default function SchoolDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
const [schoolRes, studentsRes] = await Promise.all([
          api.get(`/schools/${id}`),
          api.get('/students'),
        ]);

        setSchool(schoolRes.data.data);

        // The students list API returns the school name via `school` field.
        const schoolName = schoolRes.data.data?.name;
        const byName = (studentsRes.data.data || []).filter(
          (s: any) => s.school === schoolName
        ).length;
        setStudentCount(byName);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load school.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const fields = school
    ? [
        { label: 'Address', value: school.address },
        { label: 'Municipality', value: school.municipality },
        { label: 'District', value: school.district },
        { label: 'Province', value: school.province },
        { label: 'Principal', value: school.principal_name },
        { label: 'Phone', value: school.phone },
        { label: 'Email', value: school.email },
        {
          label: 'Established Year',
          value: school.established_year
            ? String(school.established_year)
            : '',
        },
      ].filter((f) => f.value)
    : [];

  return (
    <>
      <Navbar title="School Details" />

      <div className="p-4 md:p-8 space-y-6">

        <Link
          href="/lsp/schools"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Schools
        </Link>

        {loading ? (
          <p className="text-gray-500">Loading school...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : school ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-md">
            <div className="flex items-center gap-3 text-indigo-600">
              <School size={20} />
              <p className="text-sm font-semibold uppercase tracking-wider">
                School
              </p>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {school.name}
            </h1>

            <p className="mt-2 text-gray-500">
              {studentCount} student{studentCount === 1 ? '' : 's'} associated
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.label}>
                  <p className="text-sm text-gray-500">{f.label}</p>
                  <p className="font-semibold break-words">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                href={`/lsp/schools/edit/${id}`}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Edit School
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">School not found.</p>
          </div>
        )}

      </div>
    </>
  );
}
