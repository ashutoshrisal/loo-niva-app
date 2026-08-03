'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  Search,
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  FolderOpen,
} from 'lucide-react';

const documents = [
  {
    id: 1,
    title: 'Annual Report 2025',
    category: 'Reports',
    size: '3.4 MB',
    uploaded: '2 days ago',
  },
  {
    id: 2,
    title: 'Child Protection Policy',
    category: 'Policies',
    size: '820 KB',
    uploaded: 'Yesterday',
  },
  {
    id: 3,
    title: 'Financial Report Q2',
    category: 'Finance',
    size: '2.1 MB',
    uploaded: 'Last week',
  },
  {
    id: 4,
    title: 'Volunteer Guidelines',
    category: 'HR',
    size: '1.2 MB',
    uploaded: '5 days ago',
  },
  {
    id: 5,
    title: 'Project Proposal',
    category: 'Projects',
    size: '950 KB',
    uploaded: 'Today',
  },
  {
    id: 6,
    title: 'Meeting Minutes',
    category: 'Meetings',
    size: '700 KB',
    uploaded: '3 days ago',
  },
];

export default function DocumentsPage() {
  const [search, setSearch] = useState('');

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar title="Documents" />

      <div className="p-4 md:p-8 space-y-8">

        {/* Hero */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-10 shadow-xl">

          <p className="text-sm opacity-80 mb-2">
            📁 Document Management
          </p>

          <h1 className="text-4xl font-bold mb-3">
            Securely Store NGO Documents
          </h1>

          <p className="max-w-2xl text-blue-100">
            Organize reports, policies, project files, financial records and
            meeting documents in one secure place.
          </p>

        </div>

        {/* Search */}

        <div className="flex flex-col lg:flex-row gap-4 justify-between">

          <div className="relative flex-1 max-w-md">

            <Search
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              className="input-field pl-11"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <button className="btn-primary flex items-center gap-2">

            <Upload size={18} />

            Upload Document

          </button>

        </div>

        {/* Categories */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {[
            'Reports',
            'Policies',
            'Finance',
            'Projects',
            'Meetings',
            'HR',
          ].map((cat) => (

            <div
              key={cat}
              className="card hover:shadow-lg cursor-pointer text-center transition-all"
            >
              <FolderOpen className="mx-auto text-brand-blue mb-3" size={28} />

              <p className="font-semibold">
                {cat}
              </p>

            </div>

          ))}

        </div>

        {/* Documents */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filtered.map((doc) => (

            <div
              key={doc.id}
              className="card hover:shadow-xl transition-all duration-300"
            >

              <div className="flex justify-between items-start">

                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

                  <FileText
                    className="text-red-600"
                    size={28}
                  />

                </div>

                <span className="badge bg-blue-100 text-blue-700">

                  PDF

                </span>

              </div>

              <h2 className="font-bold text-lg mt-5">
                {doc.title}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {doc.category}
              </p>

              <div className="mt-5 space-y-1 text-sm text-gray-500">

                <p>📦 {doc.size}</p>

                <p>🕒 {doc.uploaded}</p>

              </div>

              <div className="flex justify-between mt-6">

                <button className="p-2 rounded-xl hover:bg-gray-100">
                  <Eye size={18} />
                </button>

                <button className="p-2 rounded-xl hover:bg-gray-100">
                  <Download size={18} />
                </button>

                <button className="p-2 rounded-xl hover:bg-red-50 text-red-600">
                  <Trash2 size={18} />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}