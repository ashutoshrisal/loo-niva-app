'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

import {
  CalendarDays,
  FolderKanban,
  BadgeCheck,
  Wallet,
  Hash,
  User,
  Clock,
  Pencil,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

interface Project {
  id: string;
  project_code: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  donor_name: string | null;
  budget: number | string | null;
  start_date: string | null;
  end_date: string | null;
  created_by_name?: string | null;
  created_at?: string;
  updated_at?: string;
  staff?: Array<Record<string, any>>;
}

function safeLabel(value: string | null | undefined): string {
  if (!value) return '—';
  return value.replace('_', ' ');
}

export default function ProjectProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [project, setProject] = useState<Project | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canEdit =
    user?.role === 'super_admin' || user?.role === 'project_manager';
  const canDelete = user?.role === 'super_admin';

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      setConfirmingDelete(false);
      router.push('/projects');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete project.');
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-gray-400">
          Loading project...
        </div>
      </>
    );

  if (error && !project)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </Link>
        </div>
      </>
    );

  if (!project)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          Project not found.
        </div>
      </>
    );

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </Link>

        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-8 shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div>
              <p className="text-white/80">
                NGO Project • {project.project_code || '—'}
              </p>
              <h1 className="text-4xl font-bold mt-2">
                {project.title}
              </h1>
              <p className="mt-5 max-w-3xl text-white/90">
                {project.description || 'No description available.'}
              </p>
            </div>

            {canEdit && (
              <div className="flex gap-3 h-fit">
                <Link
                  href={`/projects/edit/${project.id}`}
                  className="bg-white text-blue-700 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-blue-50"
                >
                  <Pencil size={18} />
                  Edit
                </Link>

                {canDelete && (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">
              Project Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <InfoCard
                icon={<Hash className="text-blue-600" />}
                label="Project Code"
                value={project.project_code || '—'}
              />

<InfoCard
                icon={<FolderKanban className="text-blue-600" />}
                label="Program Area"
                value={safeLabel(project.category)}
              />

              <InfoCard
                icon={<BadgeCheck className="text-green-600" />}
                label="Status"
                value={safeLabel(project.status)}
              />

              <InfoCard
                icon={<Wallet className="text-yellow-600" />}
                label="Budget"
                value={`NPR ${Number(project.budget || 0).toLocaleString()}`}
              />

              <InfoCard
                icon={<User className="text-indigo-600" />}
                label="Donor"
                value={project.donor_name || '—'}
              />

              <InfoCard
                icon={<CalendarDays className="text-cyan-600" />}
                label="Timeline"
                value={`${project.start_date?.substring(0, 10) || '—'} → ${
                  project.end_date?.substring(0, 10) || '—'
                }`}
              />

              <InfoCard
                icon={<User className="text-purple-600" />}
                label="Created By"
                value={project.created_by_name || '—'}
              />

              <InfoCard
                icon={<Clock className="text-gray-500" />}
                label="Last Updated"
                value={
                  project.updated_at
                    ? new Date(project.updated_at).toLocaleDateString()
                    : '—'
                }
              />
            </div>

            <div className="mt-10">
              <h3 className="font-bold text-lg mb-4">
                Description
              </h3>
              <div className="bg-gray-50 rounded-2xl p-5 leading-7">
                {project.description || 'No description available.'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-5">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href={`/projects/edit/${project.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
                >
                  Edit Project
                </Link>

                {canDelete && (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3"
                  >
                    Delete Project
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmingDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete Project
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete this project?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border rounded-2xl p-5 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-semibold capitalize">{value}</p>
        </div>
      </div>
    </div>
  );
}
