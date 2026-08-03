import { MapPin, ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  target_location?: string;
  progress_percentage: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  education: 'bg-blue-50 text-blue-700',
  participation: 'bg-purple-50 text-purple-700',
  advocacy: 'bg-amber-50 text-amber-700',
  protection: 'bg-rose-50 text-rose-700',
  other: 'bg-gray-100 text-gray-600',
};

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-600',
  active: 'bg-green-50 text-green-700',
  on_hold: 'bg-amber-50 text-amber-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-600',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="
      card
      group
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
          } capitalize`}
        >
          {project.category}
        </span>

        <ArrowUpRight
          size={18}
          className="text-gray-300 transition group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug group-hover:text-blue-700 transition">
        {project.title}
      </h3>

      {project.target_location && (
        <p className="flex items-center gap-2 text-gray-500 text-sm mb-5">
          <MapPin size={15} />
          {project.target_location}
        </p>
      )}

      <div className="flex justify-between items-center mb-2">
        <span
          className={`badge ${
            STATUS_COLORS[project.status]
          } capitalize`}
        >
          {project.status.replace('_', ' ')}
        </span>

        <span className="text-sm font-semibold text-gray-600">
          {project.progress_percentage}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-500 transition-all duration-700"
          style={{ width: `${project.progress_percentage}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Project Progress
      </p>
    </div>
  );
}