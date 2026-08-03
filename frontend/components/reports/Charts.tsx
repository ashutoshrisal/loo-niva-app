'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = [
  '#2563eb',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
];

export default function Charts() {
  const [projectStatus, setProjectStatus] = useState<any[]>([]);
  const [monthlyActivities, setMonthlyActivities] = useState<any[]>([]);

  useEffect(() => {
    loadCharts();
  }, []);

  async function loadCharts() {
    try {
      const [
        projectsRes,
        activitiesRes,
      ] = await Promise.all([
        api.get('/projects'),
        api.get('/activities'),
      ]);

      const projects = projectsRes.data.data || [];
      const activities = activitiesRes.data.data || [];

      const statusMap: any = {};

      projects.forEach((p: any) => {
        statusMap[p.status] =
          (statusMap[p.status] || 0) + 1;
      });

      setProjectStatus(
        Object.keys(statusMap).map((key) => ({
          name: key,
          value: statusMap[key],
        }))
      );

      const monthMap: any = {};

      activities.forEach((a: any) => {
        if (!a.activity_date) return;

        const month = new Date(
          a.activity_date
        ).toLocaleString('default', {
          month: 'short',
        });

        monthMap[month] =
          (monthMap[month] || 0) + 1;
      });

      setMonthlyActivities(
        Object.keys(monthMap).map((key) => ({
          month: key,
          total: monthMap[key],
        }))
      );

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      {/* Project Status */}

      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Project Status
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={projectStatus}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >

              {projectStatus.map(
                (_: any, index: number) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Monthly Activities */}

      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          Activities Per Month
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={monthlyActivities}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}