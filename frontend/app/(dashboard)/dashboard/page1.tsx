'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import api from '@/lib/api';
import HeroGallery from '@/components/dashboard/HeroGallery';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  CalendarClock,
  FileText,
  PlusCircle,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Summary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBeneficiaries: number;
  upcomingActivities: any[];
  recentReports: any[];
}

const PIE_COLORS = [
  '#1E3A8A',
  '#16A34A',
  '#F59E0B',
  '#DC2626',
  '#6B7280',
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [byCategory, setByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, m, a] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/monthly-activity'),
          api.get('/dashboard/analytics'),
        ]);

        setSummary(s.data.data);

        setMonthly(
          m.data.data.map((r: any) => ({
            month: r.month,
            activities: Number(r.activity_count),
          }))
        );

        setByCategory(
          a.data.data.byCategory.map((r: any) => ({
            name: r.category,
            value: Number(r.project_count),
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-4 md:p-8 space-y-6">

        {loading ? (
          <p className="text-gray-400">
            Loading dashboard data...
          </p>
        ) : (
          <>

            {/* HERO */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 p-8 text-white shadow-xl">

              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
<div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10">

  <div className="max-w-2xl">

    <p className="text-lg text-white/80">
      👋 Welcome Back
    </p>

    <h2 className="mt-1 text-2xl font-semibold">
      Loo Niva Child Concern Group
    </h2>

    <h1 className="mt-5 text-5xl font-extrabold leading-tight">
      Every Child Deserves
      <br />
      a Better Future
    </h1>

    <p className="mt-5 max-w-2xl text-white/90 text-lg">
      Empowering children through education,
      protection, participation and sustainable
      community development across Nepal.
    </p>

    <div className="mt-8 flex flex-wrap gap-4">

      <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg hover:scale-105 transition">
        <FolderKanban size={18} />
        View Projects
      </button>

      <button className="flex items-center gap-2 rounded-2xl border border-white/40 px-6 py-3 font-semibold hover:bg-white/10 transition">
        <FileText size={18} />
        Generate Report
      </button>

    </div>

  </div>

  <HeroGallery />

</div>
            </div>
            <div className="card hover:shadow-xl transition-all">

  <h3 className="font-semibold text-lg mb-6">
    Quick Actions
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <a
      href="/projects"
      className="rounded-2xl border p-5 hover:bg-blue-50 transition text-center"
    >
      <PlusCircle className="mx-auto mb-3 text-blue-600" size={32}/>
      <p className="font-semibold">New Project</p>
    </a>

    <a
      href="/activities"
      className="rounded-2xl border p-5 hover:bg-green-50 transition text-center"
    >
      <ClipboardList className="mx-auto mb-3 text-green-600" size={32}/>
      <p className="font-semibold">Record Activity</p>
    </a>

    <a
      href="/beneficiaries"
      className="rounded-2xl border p-5 hover:bg-purple-50 transition text-center"
    >
      <Users className="mx-auto mb-3 text-purple-600" size={32}/>
      <p className="font-semibold">Add Beneficiary</p>
    </a>

    <a
      href="/reports"
      className="rounded-2xl border p-5 hover:bg-orange-50 transition text-center"
    >
      <ArrowRight className="mx-auto mb-3 text-orange-600" size={32}/>
      <p className="font-semibold">Submit Report</p>
    </a>

  </div>

</div>

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <StatCard
                label="Total Projects"
                value={summary?.totalProjects ?? 0}
                icon={FolderKanban}
                accent="blue"
              />

              <StatCard
                label="Active Projects"
                value={summary?.activeProjects ?? 0}
                icon={CalendarClock}
                accent="green"
              />

              <StatCard
                label="Completed Projects"
                value={summary?.completedProjects ?? 0}
                icon={CheckCircle2}
                accent="blue"
              />

              <StatCard
                label="Total Beneficiaries"
                value={summary?.totalBeneficiaries ?? 0}
                icon={Users}
                accent="green"
              />

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="card lg:col-span-2">

                <h3 className="font-semibold mb-4">
                  Monthly Activity Trend
                </h3>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart data={monthly}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="month" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                      dataKey="activities"
                      fill="#2563eb"
                      radius={[10, 10, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                <h3 className="font-semibold mb-4">
                  Projects by Program Area
                </h3>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >

                      {byCategory.map((_, index) => (

                        <Cell
                          key={index}
                          fill={
                            PIE_COLORS[
                              index % PIE_COLORS.length
                            ]
                          }
                        />

                      ))}

                    </Pie>

                    <Legend />

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* LISTS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                <h3 className="font-semibold mb-4">
                  Upcoming Activities
                </h3>

                {summary?.upcomingActivities?.length ? (

                  <ul className="divide-y divide-gray-100">

                    {summary.upcomingActivities.map(
                      (event: any) => (

                        <li
                          key={event.id}
                          className="flex justify-between py-3"
                        >

                          <span>{event.title}</span>

                          <span className="text-gray-400 text-sm">

                            {new Date(
                              event.start_datetime
                            ).toLocaleDateString()}

                          </span>

                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <p className="text-gray-400">
                    No upcoming activities.
                  </p>

                )}

              </div>

              <div className="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                <h3 className="font-semibold mb-4">
                  Recent Reports
                </h3>

                {summary?.recentReports?.length ? (

                  <ul className="divide-y divide-gray-100">

                    {summary.recentReports.map(
                      (report: any) => (

                        <li
                          key={report.id}
                          className="flex justify-between py-3"
                        >

                          <span>{report.title}</span>

                          <span className="badge bg-gray-100 text-gray-600 capitalize">

                            {report.status}

                          </span>

                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <p className="text-gray-400">
                    No reports available.
                  </p>

                )}

              </div>

            </div>

          </>
        )}

      </div>
    </>
  );
}