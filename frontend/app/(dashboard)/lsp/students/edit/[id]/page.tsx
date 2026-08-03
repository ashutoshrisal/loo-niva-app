'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

interface School {
  id: string;
  name: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

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

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    try {
      const [studentRes, schoolRes] = await Promise.all([
        api.get(`/students/${id}`),
        api.get('/schools'),
      ]);

      const student = studentRes.data.data;

      setSchools(schoolRes.data.data);

      setForm({
        student_code: student.student_code || '',
        admission_number: student.admission_number || '',
        full_name: student.full_name || '',
        gender: student.gender || 'male',
        grade: student.grade || '',
        section: student.section || '',
        school_id: student.school_id ? String(student.school_id) : '',
        status: student.status || 'active',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load student.');
    } finally {
      setPageLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function updateStudent(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/students/${id}`, {
        ...form,
        school_id: form.school_id || null,
      });

      alert('Student updated successfully.');

      router.push('/lsp/students');
    } catch (err) {
      console.error(err);
      alert('Failed to update student.');
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">
          Loading Student...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Student
      </h1>

      <form
        onSubmit={updateStudent}
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

        <div>
          <label className="block mb-2 font-medium">
            School
          </label>

          <select
            className="w-full border p-3 rounded"
            name="school_id"
            value={form.school_id}
            onChange={handleChange}
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
            {loading ? 'Updating...' : 'Update Student'}
          </button>

        </div>

      </form>

    </div>
  );
}