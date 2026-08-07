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
  date_of_birth: string | null;
  blood_group: string | null;
  nationality: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  municipality: string | null;
  district: string | null;
  province: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  emergency_contact: string | null;
  medical_notes: string | null;
  photo_url: string | null;
  school_id: string | null;
  school: string | null;
  grade: string | null;
  section: string | null;
  admission_date: string | null;
  status: string;
  remarks: string | null;
  created_at: string | null;
  updated_at: string | null;
}
interface Sponsorship {
  id: string;
  sponsor_name: string;
  monthly_amount: number;
  sponsorship_start: string | null;
  sponsorship_end: string | null;
  status: string;
}
export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 404) {
        setError('notfound');
      } else {
        setError(err?.response?.data?.message || 'Failed to load student');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading student...
      </div>
    );

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            {error === 'notfound'
              ? 'Student not found.'
              : `Failed to load student: ${error}`}
          </p>

          <Link
            href="/lsp/students"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Student not found.
          </p>

          <Link
            href="/lsp/students"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">

      {/* BACK TO STUDENTS */}

      <div className="mb-6">
        <Link
          href="/lsp/students"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <span aria-hidden="true">&larr;</span> Back to Students
        </Link>
      </div>

      {/* HEADER */}

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">

            <img
              src={student.photo_url || "/user.jpeg"}
              alt={student.full_name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 shrink-0"
            />

            <div>

              <h1 className="text-2xl md:text-3xl font-bold break-words">
                {student.full_name}
              </h1>

              <p className="text-gray-500 mt-1">
                {student.student_code}
              </p>

              <p className="text-gray-500">
                {student.school || '-'}
                {student.grade ? ` • Grade ${student.grade}` : ''}
                {student.section ? ` • Section ${student.section}` : ''}
              </p>

              <span
                className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-semibold capitalize ${
                  student.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : student.status === 'graduated'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {student.status}
              </span>

            </div>

          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">

            <Link
              href={`/lsp/students/edit/${id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition text-center"
            >
              Edit Student
            </Link>

            <button
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg transition text-center"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Personal */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Personal Information
          </h2>

          <Info label="Student Code" value={student.student_code} />
          <Info label="Admission No." value={student.admission_number} />
          <Info label="Date of Birth" value={student.date_of_birth} />
          <Info label="Gender" value={student.gender} />
          <Info label="Blood Group" value={student.blood_group} />
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
          <Info label="Municipality" value={student.municipality} />
          <Info label="District" value={student.district} />
          <Info label="Province" value={student.province} />

        </div>

        {/* Education */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Education Information
          </h2>

          <Info label="School" value={student.school} />
          <Info label="Grade" value={student.grade} />
          <Info label="Section" value={student.section} />
          <Info label="Admission Date" value={student.admission_date} />
          <Info label="Status" value={student.status} />

        </div>

        {/* Guardian */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Guardian Information
          </h2>

          <Info label="Guardian Name" value={student.guardian_name} />
          <Info label="Guardian Phone" value={student.guardian_phone} />
          <Info label="Emergency Contact" value={student.emergency_contact} />

        </div>

        {/* Medical */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Medical Information
          </h2>

          <Info label="Medical Notes" value={student.medical_notes} />

        </div>

        {/* Remarks */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            Additional Information
          </h2>

          <Info label="Remarks" value={student.remarks} />
          <Info label="Registered On" value={student.created_at} />

        </div>

      </div>

      {/* Sponsors */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">

          <h2 className="text-xl md:text-2xl font-bold">
            Sponsors
          </h2>

          <Link
            href={`/lsp/sponsorships/add?student=${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-center"
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

            <table className="w-full min-w-[600px]">

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
                      Rs. {Number(sponsor.monthly_amount || 0).toLocaleString()}
                    </td>

                    <td>
                      {sponsor.sponsorship_start || '-'}
                    </td>

                    <td>
                      {sponsor.sponsorship_end || '-'}
                    </td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
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
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string | null | number;
}) {
  return (
    <div className="mb-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold break-words">
        {value === null || value === undefined || value === ''
          ? '-'
          : String(value)}
      </p>

    </div>
  );
}

