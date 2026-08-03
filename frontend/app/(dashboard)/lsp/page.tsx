'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import api from '@/lib/api';
import {
  GraduationCap,
  School,
  Handshake,
  CalendarCheck,
  FileText,
  FolderOpen,
} from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  grade: string;
  school: string | null;
  status: string;
}

interface DashboardStats {
  students: number;
  schools: number;
  sponsors: number;
  activeStudents: number;
}

export default function LSPPage() {
  const [students, setStudents] = useState<Student[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    students: 0,
    schools: 0,
    sponsors: 0,
    activeStudents: 0,
  });

  useEffect(() => {
    loadStudents();
    loadStats();
  }, []);

  async function loadStudents() {
    try {
      const res = await api.get('/students');
      setStudents(res.data.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteStudent(id: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this student?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/students/${id}`);

      alert('Student deleted successfully.');

      loadStudents();
      loadStats();
    } catch (err) {
      console.error(err);
      alert('Failed to delete student.');
    }
  }

  return (
    <>
      <Navbar title="Learning Support Program" />

      <div className="p-8 space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Learning Support Program
          </h1>

          <p className="text-gray-500 mt-2">
            Manage students, attendance, schools, sponsors and reports.
          </p>
        </div>

        {/* Dashboard Statistics */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          <StatCard
            label="Students"
            value={stats.students.toString()}
            icon={GraduationCap}
          />

          <StatCard
            label="Schools"
            value={stats.schools.toString()}
            icon={School}
            accent="green"
          />

          <StatCard
            label="Sponsors"
            value={stats.sponsors.toString()}
            icon={Handshake}
          />

          <StatCard
            label="Active Students"
            value={stats.activeStudents.toString()}
            icon={CalendarCheck}
            accent="green"
          />

          <StatCard
            label="Reports"
            value="82"
            icon={FileText}
          />

          <StatCard
            label="Documents"
            value="561"
            icon={FolderOpen}
            accent="green"
          />

        </div>

        {/* Quick Actions */}

        <div>

          <h2 className="text-2xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <Link
              href="/lsp/students/add"
              className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <h3 className="font-semibold text-lg">
                👨‍🎓 Add Student
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Register a new student.
              </p>
            </Link>

            <Link
  href="/lsp/sponsors"
  className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
>
  <h3 className="font-semibold text-lg">
    🤝 Sponsors
  </h3>

  <p className="text-sm text-gray-500 mt-2">
    Manage NGO sponsors and donor information.
  </p>
</Link>
           <Link
  href="/lsp/sponsors/add"
  className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
>
<Link
  href="/lsp/sponsorships"
  className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
>
  <h3 className="font-semibold text-lg">
    💳 Sponsorships
  </h3>

  <p className="text-sm text-gray-500 mt-2">
    Assign sponsors to students and manage sponsorships.
  </p>
</Link>

  <p className="text-sm text-gray-500 mt-2">
    Register a new sponsor.
  </p>
</Link>

            <button className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg transition">
              🏫 Add School
            </button>

            <button className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg transition">
              📄 Reports
            </button>

            <button className="rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-lg transition">
              📂 Documents
            </button>

          </div>

        </div>

        {/* Recent Students */}

        <div className="rounded-3xl border bg-white p-6 shadow-sm">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                Recent Students
              </h2>

              <p className="text-gray-500 text-sm">
                Recently added students.
              </p>

            </div>

            <Link
              href="/lsp/students"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              View All
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-4">Student</th>
                  <th className="text-left">School</th>
                  <th className="text-left">Grade</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>

                </tr>

              </thead>

              <tbody>

                {students.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-green-500 text-white flex items-center justify-center font-bold">

                          {student.full_name.charAt(0)}

                        </div>

                        <Link
                          href={`/lsp/students/${student.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {student.full_name}
                        </Link>

                      </div>

                    </td>

                    <td>{student.school || '-'}</td>

                    <td>{student.grade}</td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
                      </span>

                    </td>

                    <td className="space-x-3">

                      <Link
                        href={`/lsp/students/${student.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                      <Link
                        href={`/lsp/students/edit/${student.id}`}
                        className="text-green-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}