'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  student_code: string;
  grade: string;
  section: string;
  status: string;
  photo_url?: string | null;
}

interface Props {
  students: Student[];
}

export default function RecentStudents({ students }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
          Recent Students
        </h2>

        <Link
          href="/lsp/students"
          className="text-blue-600 flex items-center gap-2 hover:underline"
        >
          View All
          <ArrowRight size={16} />
        </Link>

      </div>

      <div className="space-y-4">

        {students.length === 0 && (
          <p className="text-gray-500">
            No students found.
          </p>
        )}

        {students.map((student) => (

          <Link
            key={student.id}
            href={`/lsp/students/${student.id}`}
            className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition"
          >

            <div className="flex items-center gap-4">

              <img
                src={student.photo_url || "/user.jpeg"}
                alt={student.full_name}
                className="w-12 h-12 rounded-full object-cover border"
              />

              <div>

                <h3 className="font-semibold">
                  {student.full_name}
                </h3>

                <p className="text-sm text-gray-500">
                  {student.student_code}
                </p>

                <p className="text-sm text-gray-500">
                  Grade {student.grade} • {student.section}
                </p>

              </div>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                student.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {student.status}
            </span>

          </Link>

        ))}

      </div>

    </div>
  );
}