'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import {
  Search,
  Upload,
  FileText,
  Trash2,
  X,
  Loader2,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  file_url: string;
  created_at: string;
}

const CATEGORIES = [
  'report',
  'meeting_minutes',
  'policy',
  'financial',
  'agreement',
  'other',
];

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const ALLOWED_EXTENSIONS = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'doc',
  'docx',
  'xls',
  'xlsx',
];

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'other',
    file_url: '',
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadDocuments() {
    try {
      setLoading(true);
      setError('');

      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;

      const res = await api.get('/documents', { params });
      setDocuments(res.data.data || []);
    } catch (err: any) {
      console.error('Failed to load documents:', err);
      setError(err?.response?.data?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [search, category]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.file_url.trim()) {
      setError('Title and file URL are required.');
      return;
    }

    try {
      setAdding(true);
      setError('');

      await api.post('/documents', {
        title: form.title.trim(),
        category: form.category,
        file_url: form.file_url.trim(),
      });

      setForm({ title: '', category: 'other', file_url: '' });
      setShowAdd(false);
      await loadDocuments();
    } catch (err: any) {
      console.error('Failed to add document:', err);
      setError(err?.response?.data?.message || 'Failed to add document.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    const ok = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!ok) return;

    try {
      setDeletingId(id);
      setError('');
      await api.delete(`/documents/${id}`);
      await loadDocuments();
    } catch (err: any) {
      console.error('Failed to delete document:', err);
      setError(err?.response?.data?.message || 'Failed to delete document.');
    } finally {
      setDeletingId(null);
    }
  }

  const categoryLabel = (cat: string) =>
    cat.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // ==========================================
  // FILE PICKER + VALIDATION
  // ==========================================

  function formatBytes(bytes: number): string {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
  }

  function validateFile(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload a PDF, image, DOC/DOCX, or XLS/XLSX file.';
    }
    if (file.size > MAX_SIZE) {
      return 'File is too large. Maximum size is 25MB.';
    }
    return '';
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError('');
    setUploadSuccess(false);
    setForm((prev) => ({ ...prev, file_url: '' }));

    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      setSelectedFile(null);
      e.target.value = '';
    }
  }

  async function handleUploadFile() {
    if (!selectedFile) {
      setUploadError('Please choose a file first.');
      return;
    }

    const err = validateFile(selectedFile);
    if (err) {
      setUploadError(err);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setUploadError('');
      setUploadSuccess(false);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data?.data?.url;
      if (!url) {
        throw new Error('Upload succeeded but no URL was returned.');
      }

      setForm((prev) => ({ ...prev, file_url: url }));
      setUploadSuccess(true);
    } catch (err: any) {
      console.error('File upload failed:', err);
      setUploadError(err?.response?.data?.message || 'Failed to upload file. Please try again.');
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  }

  function handleCloseModal() {
    if (uploading || adding) return;
    setShowAdd(false);
    setSelectedFile(null);
    setUploadError('');
    setUploadSuccess(false);
    setForm({ title: '', category: 'other', file_url: '' });
    setError('');
  }

  return (
    <>
      <Navbar title="Documents" />

      <div className="p-4 md:p-8 space-y-8">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-6 md:p-10 shadow-xl">
          <p className="text-sm opacity-80 mb-2">📁 Document Management</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 break-words">Securely Store NGO Documents</h1>
          <p className="max-w-2xl text-blue-100">
            Organize reports, policies, project files, financial records and
            meeting documents in one secure place.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <p>{error}</p>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Search + Add */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-4 text-gray-400" />
            <input
              className="input-field pl-11"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              className="border rounded-xl px-4 py-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setError('');
                setShowAdd(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Upload size={18} />
              Upload Document
            </button>
          </div>
        </div>

        {/* Loading / Empty / List */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <Loader2 className="mx-auto animate-spin text-indigo-600" size={32} />
            <p className="mt-4 text-gray-500">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <FolderOpen className="mx-auto text-indigo-300" size={48} />
            <h2 className="mt-4 text-xl font-bold text-gray-800">No documents found</h2>
            <p className="mt-2 text-gray-500">
              {search || category
                ? 'Try adjusting your search or filters.'
                : 'Upload your first document to get started.'}
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <Upload size={18} />
              Upload Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="card hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                    <FileText className="text-red-600" size={28} />
                  </div>
                  <span className="badge bg-blue-100 text-blue-700">
                    {categoryLabel(doc.category)}
                  </span>
                </div>

                <h2 className="font-bold text-lg mt-5">{doc.title}</h2>

                <p className="text-sm text-gray-500 mt-2">
                  {doc.created_at
                    ? new Date(doc.created_at).toLocaleDateString()
                    : 'Recent'}
                </p>

                <div className="flex justify-between mt-6">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium"
                  >
                    <FileText size={16} /> View
                  </a>

                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    disabled={deletingId === doc.id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
                <p className="mt-1 text-sm text-gray-500">Add a new document to the system.</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Annual Report 2025"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">File *</label>
                <div className="rounded-xl border border-dashed border-gray-300 p-4">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    PDF, JPG, PNG, DOC/DOCX, XLS/XLSX — max 25MB
                  </p>

                  {selectedFile && (
                    <div className="mt-3 rounded-xl bg-gray-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={16} className="shrink-0 text-indigo-600" />
                          <span className="truncate text-sm font-medium text-gray-700">
                            {selectedFile.name}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500">
                          {formatBytes(selectedFile.size)}
                        </span>
                      </div>

                      {!form.file_url && !uploading && (
                        <button
                          type="button"
                          onClick={handleUploadFile}
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          <Upload size={16} />
                          Upload
                        </button>
                      )}

                      {uploading && (
                        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                          <Loader2 className="animate-spin" size={16} />
                          Uploading...
                        </div>
                      )}

                      {uploadSuccess && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                          <CheckCircle2 size={16} />
                          File uploaded successfully
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {form.file_url && !selectedFile && (
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-green-700">
                    <CheckCircle2 size={16} />
                    File ready to save
                  </p>
                )}

                {uploadError && (
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    <AlertCircle size={16} className="shrink-0" />
                    {uploadError}
                  </div>
                )}
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={uploading || adding}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding || uploading || !form.file_url}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {adding ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  {adding ? 'Saving...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
