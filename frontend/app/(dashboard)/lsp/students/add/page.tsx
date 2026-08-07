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
    photo_url: '',
  });

  const [loading, setLoading] = useState(false);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB

  function validateImage(file: File): string {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload a JPG, PNG, or WEBP image.';
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return 'Image is too large. Maximum size is 25MB.';
    }
    return '';
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError('');
    setForm((prev) => ({ ...prev, photo_url: '' }));

    if (!file) {
      setPreviewUrl('');
      return;
    }

    const err = validateImage(file);
    if (err) {
      setUploadError(err);
      setSelectedFile(null);
      setPreviewUrl('');
      e.target.value = '';
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUploadImage() {
    if (!selectedFile) {
      setUploadError('Please choose an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setUploadError('');

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data?.data?.url;
      if (!url) {
        throw new Error('Upload succeeded but no URL was returned.');
      }

      setForm((prev) => ({ ...prev, photo_url: url }));
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err?.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  }

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

    if (uploading) {
      alert('Please wait for the image upload to finish.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/students', {
        ...form,
        school_id: form.school_id || null,
        photo_url: form.photo_url || null,
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

        {/* Profile Photo */}

        <div className="border rounded-xl p-4">

          <label className="block mb-2 font-medium">
            Profile Photo
          </label>

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:px-4 file:py-2 file:rounded file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700"
          />

          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG or WEBP — max 25MB (optional)
          </p>

          {previewUrl && (
            <div className="mt-3 flex items-center gap-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-200"
              />

              {!form.photo_url && !uploading && (
                <button
                  type="button"
                  onClick={handleUploadImage}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  Upload Image
                </button>
              )}

              {uploading && (
                <span className="text-sm text-gray-500">
                  Uploading...
                </span>
              )}

              {form.photo_url && (
                <span className="text-sm text-green-600 font-medium">
                  Image uploaded
                </span>
              )}
            </div>
          )}

          {uploadError && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {uploadError}
            </p>
          )}

        </div>

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
