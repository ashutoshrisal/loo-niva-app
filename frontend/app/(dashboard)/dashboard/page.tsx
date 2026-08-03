'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroGallery from '@/components/dashboard/HeroGallery';

import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RecentStudents from '@/components/dashboard/RecentStudents';
import RecentSponsors from '@/components/dashboard/RecentSponsors';
import api from '@/lib/api';

interface Summary {
  totalStudents: number;
  totalSchools: number;
  totalSponsors: number;
  totalSponsorships: number;
  activeStudents: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<Summary>({
    totalStudents: 0,
    totalSchools: 0,
    totalSponsors: 0,
    totalSponsorships: 0,
    activeStudents: 0,
  });

  const [gradeData, setGradeData] = useState<any[]>([]);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [schoolData, setSchoolData] = useState<any[]>([]);

  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentSponsors, setRecentSponsors] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [
        summaryRes,
        analyticsRes,
        studentsRes,
        sponsorsRes,
      ] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/analytics'),
        api.get('/students'),
        api.get('/sponsors'),
      ]);

      setSummary(summaryRes.data.data);

      setGradeData(
        analyticsRes.data.data.grades || []
      );

      setGenderData(
        analyticsRes.data.data.gender || []
      );

      setCountryData(
        analyticsRes.data.data.sponsorCountries || []
      );

      setSchoolData(
        analyticsRes.data.data.schools || []
      );

      setRecentStudents(
        studentsRes.data.data.slice(0, 5)
      );

      setRecentSponsors(
        sponsorsRes.data.data.slice(0, 5)
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          Loading Dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-8 space-y-8">

        {/* HERO */}

        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 text-white p-8 shadow-xl">

          <div className="flex flex-col xl:flex-row justify-between items-center gap-10">

            <div>

              <p className="text-white/80">
                Welcome Back 👋
              </p>

              <h1 className="text-5xl font-bold mt-3">
                Loo Niva Child Concern Group
              </h1>

              <p className="mt-5 text-lg text-white/90 max-w-2xl">
                Empowering children through education,
                sponsorship and community development.
              </p>

            </div>

            <HeroGallery />

          </div>

        </div>

        <DashboardStats summary={summary} />

        <QuickActions />

        <DashboardCharts
          gradeData={gradeData}
          genderData={genderData}
          countryData={countryData}
          schoolData={schoolData}
        />

        <div className="grid xl:grid-cols-2 gap-6">

          <RecentStudents
            students={recentStudents}
          />

          <RecentSponsors
            sponsors={recentSponsors}
          />

        </div>

      </div>

    </>
  );
}