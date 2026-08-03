'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

import {
  CalendarDays,
  MapPin,
  Wallet,
  FolderKanban,
  BadgeCheck,
  Pencil,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  budget: number;
  funding_source: string;
  target_location: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function ProjectProfilePage() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [project, setProject] =
    useState<Project | null>(null);

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {

      const res = await api.get(`/projects/${id}`);

      setProject(res.data.data);

    } catch (err) {

      console.error(err);

      alert('Failed to load project');

    } finally {

      setLoading(false);

    }
  }

  async function deleteProject() {

    if (!confirm('Delete this project?'))
      return;

    try {

      await api.delete(`/projects/${id}`);

      alert('Project deleted.');

      router.push('/projects');

    } catch (err) {

      console.error(err);

      alert('Failed to delete project.');

    }

  }

  if (loading)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          Loading...
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

  const progress =
    project.status === 'completed'
      ? 100
      : project.status === 'active'
      ? 65
      : project.status === 'planned'
      ? 10
      : project.status === 'on_hold'
      ? 40
      : 0;

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
                NGO Project
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {project.title}
              </h1>

              <p className="mt-5 max-w-3xl text-white/90">
                {project.description}
              </p>

            </div>

            <div className="flex gap-3 h-fit">

              <Link
                href={`/projects/edit/${project.id}`}
                className="bg-white text-blue-700 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold"
              >
                <Pencil size={18} />
                Edit
              </Link>

              <button
                onClick={deleteProject}
                className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>

            </div>

          </div>

        </div>
                <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-bold mb-6">
              Project Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <InfoCard
                icon={<FolderKanban className="text-blue-600" />}
                label="Program Area"
                value={project.category}
              />

              <InfoCard
                icon={<BadgeCheck className="text-green-600" />}
                label="Status"
                value={project.status.replace('_', ' ')}
              />

              <InfoCard
                icon={<Wallet className="text-yellow-600" />}
                label="Budget"
                value={`NPR ${Number(project.budget).toLocaleString()}`}
              />

              <InfoCard
                icon={<MapPin className="text-red-600" />}
                label="Target Location"
                value={project.target_location || '-'}
              />

              <InfoCard
                icon={<Wallet className="text-indigo-600" />}
                label="Funding Source"
                value={project.funding_source || '-'}
              />

              <InfoCard
                icon={<CalendarDays className="text-cyan-600" />}
                label="Timeline"
                value={`${project.start_date || '-'} → ${project.end_date || '-'}`}
              />

            </div>

            <div className="mt-10">

              <h3 className="font-bold text-lg mb-4">
                Progress
              </h3>

              <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">

                <div
                  style={{
                    width: `${progress}%`,
                  }}
                  className="bg-blue-600 h-5 rounded-full transition-all"
                />

              </div>

              <div className="mt-2 flex justify-between text-sm text-gray-500">

                <span>
                  Project Progress
                </span>

                <span className="font-semibold">
                  {progress}%
                </span>

              </div>

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
                Statistics
              </h2>

              <div className="space-y-5">

                <Stat
                  label="Activities"
                  value="0"
                />

                <Stat
                  label="Beneficiaries"
                  value="0"
                />

                <Stat
                  label="Documents"
                  value="0"
                />

                <Stat
                  label="Photos"
                  value="0"
                />

              </div>

            </div>

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

                <button
                  onClick={deleteProject}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3"
                >
                  Delete Project
                </button>

              </div>

            </div>

          </div>

        </div>
              </div>

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

          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="font-semibold capitalize">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center border-b pb-3">

      <span className="text-gray-600">
        {label}
      </span>

      <span className="font-bold text-lg">
        {value}
      </span>

    </div>
  );
}