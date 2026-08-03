'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface School {
  id: string;
  name: string;
}

export default function AddStudentPage() {
  const router = useRouter();

  const [schools, setSchools] = useState<School[]>([]);

  const [form, setForm] = useState({
    student_code: '',
    admission_number: '',
    full_name: '',
    gender: 'male',
    grade: '',
    section: '',
    school_id: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      const res = await api.get('/schools');
      setSchools(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load schools.');
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function saveStudent(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post('/students', {
        ...form,
        school_id: form.school_id || null,
      });

      alert('Student added successfully.');

      router.push('/lsp/students');
    } catch (err) {
      console.error(err);
      alert('Failed to add student.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Add Student
      </h1>

      <form
        onSubmit={saveStudent}
        className="space-y-4 bg-white shadow rounded-xl p-6"
      >

        <input
          className="w-full border p-3 rounded"
          placeholder="Student Code"
          name="student_code"
          value={form.student_code}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Admission Number"
          name="admission_number"
          value={form.admission_number}
          onChange={handleChange}
          required
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Full Name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <select
          className="w-full border p-3 rounded"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          className="w-full border p-3 rounded"
          placeholder="Grade"
          name="grade"
          value={form.grade}
          onChange={handleChange}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Section"
          name="section"
          value={form.section}
          onChange={handleChange}
        />

        {/* School Dropdown */}

        <div>

          <label className="block mb-2 font-medium">
            School
          </label>

          <select
            name="school_id"
            value={form.school_id}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="">
              Select School
            </option>

            {schools.map((school) => (
              <option
                key={school.id}
                value={school.id}
              >
                {school.name}
              </option>
            ))}

          </select>

        </div>

        <select
          className="w-full border p-3 rounded"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            {loading ? 'Saving...' : 'Save Student'}
          </button>

        </div>

      </form>

    </div>
  );
}