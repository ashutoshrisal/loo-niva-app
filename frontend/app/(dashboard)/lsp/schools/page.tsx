'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface School {
  id: string;
  name: string;
  students: number;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      const res = await api.get('/schools');
      setSchools(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load schools');
    } finally {
      setLoading(false);
    }
  }

  async function deleteSchool(id: string) {
    const ok = window.confirm(
      'Are you sure you want to delete this school?'
    );

    if (!ok) return;

    try {
      await api.delete(`/schools/${id}`);

      alert('School deleted successfully.');

      loadSchools();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          'Failed to delete school.'
      );
    }
  }

  const filtered = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar title="Schools" />

      <div className="max-w-7xl mx-auto p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Schools
            </h1>

            <p className="text-gray-500 mt-1">
              Manage partner schools.
            </p>

          </div>

          <Link
            href="/lsp/schools/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            + Add School
          </Link>

        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <input
            type="text"
            placeholder="Search school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">

          {loading ? (

            <div className="p-8 text-center">
              Loading...
            </div>

          ) : filtered.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              No schools found.
            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    School Name
                  </th>

                  <th className="text-left">
                    Students
                  </th>

                  <th className="text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.map((school) => (

                  <tr
                    key={school.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {school.name}
                    </td>

                    <td>
                      {school.students}
                    </td>

                    <td>

                      <div className="flex justify-center gap-4">

                        <Link
                          href={`/lsp/schools/edit/${school.id}`}
                          className="text-green-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteSchool(school.id)
                          }
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>
    </>
  );
}