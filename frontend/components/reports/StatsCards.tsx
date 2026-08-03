'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

import {
  GraduationCap,
  Users,
  FolderKanban,
  CalendarCheck,
  Handshake,
  School,
  Wallet,
  TrendingUp,
} from 'lucide-react';

export default function StatsCards() {
  const [stats, setStats] = useState({
    students: 0,
    beneficiaries: 0,
    projects: 0,
    activities: 0,
    sponsors: 0,
    schools: 0,
    budgetReceived: 0,
    budgetUtilized: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [
        students,
        beneficiaries,
        projects,
        activities,
        sponsors,
        schools,
      ] = await Promise.all([
        api.get('/students'),
        api.get('/beneficiaries'),
        api.get('/projects'),
        api.get('/activities'),
        api.get('/sponsors'),
        api.get('/schools'),
      ]);

      const projectList = projects.data.data || [];

      const budgetReceived = projectList.reduce(
        (sum: number, p: any) => sum + Number(p.budget || 0),
        0
      );

      const budgetUtilized = projectList.reduce(
        (sum: number, p: any) =>
          sum + Number(p.budget_utilized || 0),
        0
      );

      setStats({
        students: students.data.data.length,
        beneficiaries: beneficiaries.data.data.length,
        projects: projectList.length,
        activities: activities.data.data.length,
        sponsors: sponsors.data.data.length,
        schools: schools.data.data.length,
        budgetReceived,
        budgetUtilized,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const cards = [
    {
      title: 'Students',
      value: stats.students,
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Beneficiaries',
      value: stats.beneficiaries,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'bg-indigo-500',
    },
    {
      title: 'Activities',
      value: stats.activities,
      icon: CalendarCheck,
      color: 'bg-orange-500',
    },
    {
      title: 'Sponsors',
      value: stats.sponsors,
      icon: Handshake,
      color: 'bg-pink-500',
    },
    {
      title: 'Schools',
      value: stats.schools,
      icon: School,
      color: 'bg-purple-500',
    },
    {
      title: 'Budget Received',
      value: `NPR ${stats.budgetReceived.toLocaleString()}`,
      icon: Wallet,
      color: 'bg-emerald-500',
    },
    {
      title: 'Budget Utilized',
      value: `NPR ${stats.budgetUtilized.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-6"
          >
            <div
              className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5`}
            >
              <Icon size={28} />
            </div>

            <p className="text-gray-500 text-sm">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}