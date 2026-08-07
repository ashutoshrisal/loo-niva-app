'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'education',
  'child_protection',
  'health',
  'livelihood',
  'advocacy',
  'emergency',
  'other',
];
const STATUSES = ['planning', 'active', 'on_hold', 'completed', 'cancelled'];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canManage = user?.role === 'super_admin' || user?.role === 'project_manager';

  async function load() {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      const { data } = await api.get('/projects', { params });
      setProjects(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  }

useEffect(() => { load(); }, [search, category, status]);

  return (
    <>
      <Navbar title="Projects" />
      <div className="p-4 md:p-8 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">

  <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>

  <div className="relative z-10">

    <p className="text-white/80 text-lg">
      📂 Project Management
    </p>

    <h1 className="mt-2 text-4xl font-bold">
      Manage Every
      <br />
      Project Efficiently
    </h1>

    <p className="mt-4 max-w-2xl text-white/90">
      Plan, monitor and track every NGO project from one place.
      Stay organized and measure your impact.
    </p>

  </div>

</div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative w-80">
    <Search className="absolute left-3 top-3 text-gray-400" size={18} />

    <input
    className="input-field pl-10"
    placeholder="Search Projects..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>
</div>
            <select className="input-field w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>

          {canManage && (
           <Link
    href="/projects/add"
    className="btn-primary flex items-center gap-2"
>
    <Plus size={18}/>
    New Project
</Link>
          )}
        </div>

{loading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
            <p className="font-semibold mb-1">Unable to load projects</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : projects.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        ) : (
          <p className="text-gray-400">No projects found. {canManage && 'Create the first one above.'}</p>
        )}
      </div>

      
    </>
  );
}
