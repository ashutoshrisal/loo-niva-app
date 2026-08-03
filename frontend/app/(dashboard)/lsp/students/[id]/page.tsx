
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Student {
  id: string;
  student_code: string;
  admission_number: string;
  full_name: string;
  gender: string;
  grade: string;
  section: string;
  nationality: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  medical_notes: string | null;
  status: string;
  photo_url: string | null;

  school: string | null;
}
interface Sponsorship {
  id: string;
  sponsor_name: string;
  monthly_amount: number;
  sponsorship_start: string;
  sponsorship_end: string;
  status: string;
}
export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, []);

  async function loadStudent() {
    try {
     const [studentRes, sponsorRes] = await Promise.all([
  api.get(`/students/${id}`),
  api.get(`/sponsorships/student/${id}`),
]);

setStudent(studentRes.data.data);
setSponsorships(sponsorRes.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load student');
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="p-8 text-center text-gray-500">Loading...</p>;

  if (!student)
    return <p className="p-8 text-center">Student not found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* HEADER */}

      <div className="bg-white rounded-xl shadow-md p-8 mb-8">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">

          <div className="flex items-center gap-6">

            <img
  src={student.photo_url || "/user.jpeg"}
  alt={student.full_name}
  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
/>

            <div>

              <h1 className="text-3xl font-bold">
                {student.full_name}
              </h1>

              <p className="text-gray-500 mt-1">
                {student.student_code}
              </p>

              <p className="text-gray-500">
                Grade {student.grade} • Section {student.section}
              </p>

              <span
                className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-semibold ${
                  student.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {student.status}
              </span>

            </div>

          </div>
<div className="flex gap-3">

  <Link
    href={`/lsp/students/edit/${id}`}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
  >
    Edit Student
  </Link>

  <button
    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
  >
    Delete
  </button>

</div>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Student */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Student Information
          </h2>

          <Info label="Student Code" value={student.student_code} />
          <Info label="Admission No." value={student.admission_number} />
          <Info label="Gender" value={student.gender} />
          <Info label="Grade" value={student.grade} />
          
          <Info label="School" value={student.school} />
          <Info label="Nationality" value={student.nationality} />

        </div>

        {/* Contact */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Contact Information
          </h2>

          <Info label="Phone" value={student.phone} />
          <Info label="Email" value={student.email} />
          <Info label="Address" value={student.address} />

        </div>

        {/* Guardian */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Guardian Information
          </h2>

          <Info label="Guardian Name" value={student.guardian_name} />
          <Info label="Guardian Phone" value={student.guardian_phone} />

        </div>

        {/* Medical */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Medical Information
          </h2>

          <Info label="Medical Notes" value={student.medical_notes} />

        </div>
        {/* Sponsors */}

<div className="bg-white rounded-xl shadow p-6 mt-8">

  <div className="flex justify-between items-center mb-6">

    <h2 className="text-2xl font-bold">
      Sponsors
    </h2>

    <Link
      href={`/lsp/sponsorships/add?student=${id}`}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
    >
      + Add Sponsorship
    </Link>

  </div>

  {sponsorships.length === 0 ? (

    <div className="text-center py-10 text-gray-500">
      No sponsors assigned yet.
    </div>

  ) : (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">Sponsor</th>
            <th className="text-left">Monthly Amount</th>
            <th className="text-left">Start</th>
            <th className="text-left">End</th>
            <th className="text-left">Status</th>

          </tr>

        </thead>

        <tbody>

          {sponsorships.map((sponsor) => (

            <tr
              key={sponsor.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4 font-medium">
                {sponsor.sponsor_name}
              </td>

              <td>
                Rs. {Number(sponsor.monthly_amount).toLocaleString()}
              </td>

              <td>
                {sponsor.sponsorship_start}
              </td>

              <td>
                {sponsor.sponsorship_end}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sponsor.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {sponsor.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

</div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="mb-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold break-words">
        {value || '-'}
      </p>

    </div>
  );
}