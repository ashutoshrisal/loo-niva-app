'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#2563EB',
  '#16A34A',
  '#F59E0B',
  '#DC2626',
  '#7C3AED',
  '#0891B2',
  '#EA580C',
];

interface AnalyticsData {
  grades: any[];
  gender: any[];
  sponsorCountries: any[];
  schools: any[];
}

export default function LSPAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    grades: [],
    gender: [],
    sponsorCountries: [],
    schools: [],
  });
  const [sponsorshipStatus, setSponsorshipStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [analyticsRes, sponsorshipsRes] = await Promise.all([
        api.get('/dashboard/analytics'),
        api.get('/sponsorships'),
      ]);

      const data = analyticsRes.data.data || {};

      setAnalytics({
        grades: data.grades || [],
        gender: data.gender || [],
        sponsorCountries: data.sponsorCountries || [],
        schools: data.schools || [],
      });

      // Compute sponsorship status from real sponsorship data
      const statusMap: Record<string, number> = {};
      (sponsorshipsRes.data.data || []).forEach((s: any) => {
        const key = s.status || 'unknown';
        statusMap[key] = (statusMap[key] || 0) + 1;
      });

      setSponsorshipStatus(
        Object.keys(statusMap).map((key) => ({
          name: key,
          value: statusMap[key],
        }))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Students by Grade */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Students by Grade</h2>
        {analytics.grades.length === 0 ? (
          <EmptyState message="No grade data available." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.grades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Students by Gender */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Students by Gender</h2>
        {analytics.gender.length === 0 ? (
          <EmptyState message="No gender data available." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.gender}
                dataKey="count"
                nameKey="gender"
                outerRadius={110}
                label
              >
                {analytics.gender.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Students by School */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Students by School</h2>
        {analytics.schools.length === 0 ? (
          <EmptyState message="No school data available." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.schools}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16A34A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sponsorship Overview */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-5">Sponsorship Overview</h2>
        {sponsorshipStatus.length === 0 ? (
          <EmptyState message="No sponsorship data available." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sponsorshipStatus}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {sponsorshipStatus.map((_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-gray-500">{message}</div>
  );
}
