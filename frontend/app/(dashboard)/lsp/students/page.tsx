'use client';

import { useEffect, useState } from 'react';
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
  status: string;
  school: string | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const res = await api.get('/students');
      setStudents(res.data.data);
    } catch (err: any) {
      console.error(err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading students...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          LSP Students
        </h1>

        <Link
          href="/lsp/students/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Student
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Admission</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">School</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {students.map((student) => (

              <tr
                key={student.id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-3">{student.student_code}</td>

                <td className="p-3">{student.admission_number}</td>

                <td className="p-3 font-semibold">
                  {student.full_name}
                </td>

                <td className="p-3 capitalize">
                  {student.gender}
                </td>

                <td className="p-3">
                  {student.grade}
                </td>

                <td className="p-3">
                  {student.section}
                </td>

                <td className="p-3 capitalize">
                  {student.status}
                </td>

                <td className="p-3">
                  {student.school || '-'}
                </td>

                <td className="p-3">

                  <div className="flex gap-2 justify-center">

                    <Link
                      href={`/lsp/students/${student.id}`}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    >
                      View
                    </Link>

                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}