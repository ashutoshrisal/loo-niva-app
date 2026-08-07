'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Eye,
  Pencil,
  Trash2,
  Wallet,
  CalendarDays,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export interface Project {
  id: string;
  project_code: string;
  title: string;
  category: string;
  description: string;
  donor_name: string | null;
  budget: number | string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  education: 'bg-blue-50 text-blue-700',
  child_protection: 'bg-purple-50 text-purple-700',
  health: 'bg-rose-50 text-rose-700',
  livelihood: 'bg-emerald-50 text-emerald-700',
  advocacy: 'bg-amber-50 text-amber-700',
  emergency: 'bg-orange-50 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
};

const STATUS_COLORS: Record<string, string> = {
  planning: 'bg-gray-100 text-gray-600',
  active: 'bg-green-50 text-green-700',
  on_hold: 'bg-amber-50 text-amber-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-600',
};

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const { user } = useAuth();

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const canEdit =
    user?.role === 'super_admin' || user?.role === 'project_manager';
  const canDelete = user?.role === 'super_admin';

  const budget = Number(project.budget) || 0;

  function openDetails() {
    router.push(`/projects/${project.id}`);
  }

  function openEdit(e: React.MouseEvent) {
    e.stopPropagation();
    router.push(`/projects/edit/${project.id}`);
  }

  async function confirmDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setError('');
    setConfirming(true);
  }

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/projects/${project.id}`);
      setConfirming(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to delete project.'
      );
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  }

  function cancelDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirming(false);
  }

  return (
    <div
      onClick={openDetails}
      className="
        card
        group
        relative
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
        hover:border-blue-300
      "
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`badge ${
            CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other
          }`}
        >
          {project.category.replace('_', ' ')}
        </span>

        <span className="text-xs text-gray-400 font-mono">
          {project.project_code || '—'}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug group-hover:text-blue-700 transition">
        {project.title}
      </h3>

      {project.donor_name && (
        <p className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <Wallet size={15} />
          {project.donor_name}
        </p>
      )}

      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <CalendarDays size={15} />
        <span>
          {project.start_date
            ? project.start_date.substring(0, 10)
            : '—'}{' '}
          →{' '}
          {project.end_date
            ? project.end_date.substring(0, 10)
            : '—'}
        </span>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span
          className={`badge ${
            STATUS_COLORS[project.status] || STATUS_COLORS.planning
          }`}
        >
          {project.status.replace('_', ' ')}
        </span>

        <span className="text-sm font-semibold text-gray-600">
          NPR {budget.toLocaleString()}
        </span>
      </div>

      {/* Hover actions */}
      <div className="mt-4 flex gap-2 justify-end opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDetails();
          }}
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center gap-1"
        >
          <Eye size={14} />
          View
        </button>

        {canEdit && (
          <button
            onClick={openEdit}
            className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs font-semibold flex items-center gap-1"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}

        {canDelete && (
          <button
            onClick={confirmDelete}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg p-2">
          {error}
        </p>
      )}

      {/* Delete confirmation dialog */}
      {confirming && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4 z-10"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-5 w-full max-w-xs">
            <p className="font-semibold text-gray-800 mb-1">
              Delete project?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this project?
            </p>
            {error && (
              <p className="text-xs text-red-600 mb-3">{error}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
