'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

import {
  GraduationCap,
  HeartHandshake,
  FolderKanban,
  CalendarDays,
  School,
  Users,
  Wallet,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Pencil,
  Trash2,
  Save,
  X,
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const COLORS = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B'];

type Activity = {
  id: number;
  title: string;
  activity_date: string;
};

type DashboardData = {
  stats: {
    students: number;
    beneficiaries: number;
    sponsors: number;
    schools: number;
    projects: number;
    activities: number;
    donations: number;
    budget: number;
  };

  recentActivities: Activity[];

  monthlyActivities: {
    month: string;
    total: number;
  }[];

  monthlyDonations: {
    month: string;
    total: number;
  }[];

  projectStatus: {
    status: string;
    total: number;
  }[];

  beneficiaryGender: {
    gender: string;
    total: number;
  }[];
};

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [editingActivity, setEditingActivity] =
    useState<Activity | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  // ==========================
  // LOAD REPORTS
  // ==========================

  const loadReports = async () => {
    try {
      const res = await api.get('/reports');

      setData(res.data.data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ==========================
  // OPEN EDIT
  // ==========================

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);

    setEditTitle(activity.title);

    setEditDate(
      activity.activity_date
        ? activity.activity_date.split('T')[0]
        : ''
    );
  };

  // ==========================
  // SAVE EDIT
  // ==========================

  const handleSaveEdit = async () => {
    if (!editingActivity) return;

    if (!editTitle.trim()) {
      alert('Activity title is required');
      return;
    }

    try {
      setSaving(true);

      await api.put(
        `/activities/${editingActivity.id}`,
        {
          title: editTitle,
          activity_date: editDate,
        }
      );

      alert('Activity updated successfully');

      setEditingActivity(null);

      await loadReports();
    } catch (error: any) {
      console.error('Update activity error:', error);

      alert(
        error.response?.data?.message ||
          'Failed to update activity'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // DELETE ACTIVITY
  // ==========================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this activity?'
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/activities/${id}`);

      alert('Activity deleted successfully');

      await loadReports();
    } catch (error: any) {
      console.error('Delete activity error:', error);

      alert(
        error.response?.data?.message ||
          'Failed to delete activity'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (!data) {
    return (
      <>
        <Navbar title="Reports" />

        <div className="p-8">
          Loading...
        </div>
      </>
    );
  }

  // ==========================
  // REPORT CARDS
  // ==========================

  const cards = [
    {
      title: 'Students',
      value: data.stats.students,
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Beneficiaries',
      value: data.stats.beneficiaries,
      icon: HeartHandshake,
      color: 'bg-pink-500',
    },
    {
      title: 'Projects',
      value: data.stats.projects,
      icon: FolderKanban,
      color: 'bg-green-500',
    },
    {
      title: 'Activities',
      value: data.stats.activities,
      icon: CalendarDays,
      color: 'bg-orange-500',
    },
    {
      title: 'Schools',
      value: data.stats.schools,
      icon: School,
      color: 'bg-indigo-500',
    },
    {
      title: 'Sponsors',
      value: data.stats.sponsors,
      icon: Users,
      color: 'bg-violet-500',
    },
    {
      title: 'Donations',
      value: `NPR ${data.stats.donations.toLocaleString()}`,
      icon: Wallet,
      color: 'bg-emerald-500',
    },
    {
      title: 'Budget Utilized',
      value: `NPR ${data.stats.budget.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-red-500',
    },
  ];

  // ==========================
  // DOWNLOAD PDF
  // ==========================

  const downloadPDF = async () => {
    try {
      const res = await api.get('/reports/export/pdf', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement('a');

      link.href = url;

      link.download = 'loo-niva-organization-report.pdf';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('PDF export error:', error);

      alert(
        error.response?.data?.message ||
          'Failed to download PDF report'
      );
    }
  };

  // ==========================
  // DOWNLOAD EXCEL
  // ==========================

  const downloadExcel = async () => {
    try {
      const res = await api.get('/reports/export/excel', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement('a');

      link.href = url;

      link.download = 'loo-niva-organization-report.xlsx';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Excel export error:', error);

      alert(
        error.response?.data?.message ||
          'Failed to download Excel report'
      );
    }
  };

  // ==========================
  // PAGE
  // ==========================

  return (
    <>
      <Navbar title="Organization Reports" />

      <div className="p-8 space-y-8">

        {/* ==========================
            HEADER
        ========================== */}

        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 to-blue-600 text-white p-8 shadow-xl">
          <h1 className="text-4xl font-bold">
            Loo Niva Organization Reports
          </h1>

          <p className="mt-3 text-blue-100">
            Executive summary of organizational performance.
          </p>

          <div className="mt-6 flex gap-4">

            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <Download size={18} />
              Export PDF
            </button>

            <button
              onClick={downloadExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>

          </div>
        </div>

        {/* ==========================
            STAT CARDS
        ========================== */}

        <div className="grid md:grid-cols-4 gap-6">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center text-white`}
                >
                  <Icon size={28} />
                </div>

                <h2 className="mt-5 text-gray-500">
                  {card.title}
                </h2>

                <p className="text-3xl font-bold mt-2">
                  {card.value}
                </p>
              </div>
            );
          })}

        </div>

        {/* ==========================
            RECENT ACTIVITIES
        ========================== */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Recent Activities
            </h2>

            <span className="text-sm text-gray-500">
              {data.recentActivities.length} recent activities
            </span>

          </div>

          <div className="space-y-3">

            {data.recentActivities.length === 0 ? (

              <div className="text-gray-500 py-6 text-center">
                No activities found.
              </div>

            ) : (

              data.recentActivities.map((activity) => (

                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-3 pt-2 hover:bg-gray-50 px-3 rounded-lg transition"
                >

                  {/* ACTIVITY INFO */}

                  <div>

                    <p className="font-medium">
                      {activity.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        activity.activity_date
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="flex items-center gap-2">

                    {/* EDIT */}

                    <button
                      onClick={() => handleEdit(activity)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      <Pencil size={16} />

                      <span className="hidden sm:inline">
                        Edit
                      </span>
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDelete(activity.id)
                      }
                      disabled={
                        deletingId === activity.id
                      }
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                    >

                      <Trash2 size={16} />

                      <span className="hidden sm:inline">
                        {deletingId === activity.id
                          ? 'Deleting...'
                          : 'Delete'}
                      </span>

                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

        {/* ==========================
            CHARTS
        ========================== */}
        {/* ==========================
    FINANCIAL REPORTS
========================== */}

<div className="grid lg:grid-cols-2 gap-8">

  {/* MONTHLY DONATIONS */}

  <div className="bg-white rounded-2xl shadow-md p-6">

    <div className="flex items-center justify-between mb-6">

      <div>
        <h2 className="text-xl font-bold">
          Monthly Donations
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Donation trends over time
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">
          Total
        </p>

        <p className="text-xl font-bold text-emerald-600">
          NPR {data.stats.donations.toLocaleString()}
        </p>
      </div>

    </div>

    {data.monthlyDonations.length === 0 ? (

      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No donation data available
      </div>

    ) : (

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={data.monthlyDonations}
        >

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value: number) =>
              [`NPR ${Number(value).toLocaleString()}`, 'Donations']
            }
          />

          <Bar
            dataKey="total"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    )}

  </div>


  {/* PROJECT BUDGET */}

  <div className="bg-white rounded-2xl shadow-md p-6">

    <h2 className="text-xl font-bold mb-6">
      Project Budget
    </h2>

    <div className="space-y-6">

      {/* TOTAL BUDGET */}

      <div className="flex items-center justify-between p-5 bg-blue-50 rounded-xl">

        <div>
          <p className="text-sm text-gray-500">
            Total Project Budget
          </p>

          <p className="text-2xl font-bold text-blue-700 mt-1">
            NPR {data.stats.budget.toLocaleString()}
          </p>
        </div>

        <TrendingUp
          className="text-blue-600"
          size={32}
        />

      </div>


      {/* TOTAL DONATIONS */}

      <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-xl">

        <div>
          <p className="text-sm text-gray-500">
            Total Donations
          </p>

          <p className="text-2xl font-bold text-emerald-700 mt-1">
            NPR {data.stats.donations.toLocaleString()}
          </p>
        </div>

        <Wallet
          className="text-emerald-600"
          size={32}
        />

      </div>


      {/* DIFFERENCE */}

      <div className="flex items-center justify-between p-5 bg-purple-50 rounded-xl">

        <div>
          <p className="text-sm text-gray-500">
            Budget Difference
          </p>

          <p className="text-2xl font-bold text-purple-700 mt-1">
            NPR{' '}
            {(
              data.stats.donations -
              data.stats.budget
            ).toLocaleString()}
          </p>
          {/* ==========================
    FINANCIAL REPORTS
========================== */}

<div className="grid lg:grid-cols-2 gap-8">

  {/* MONTHLY DONATIONS */}

  <div className="bg-white rounded-2xl shadow-md p-6">

    <div className="flex items-center justify-between mb-6">

      <div>
        <h2 className="text-xl font-bold">
          Monthly Donations
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Donation trends over time
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">
          Total
        </p>

        <p className="text-xl font-bold text-emerald-600">
          NPR {data.stats.donations.toLocaleString()}
        </p>
      </div>

    </div>

    {data.monthlyDonations.length === 0 ? (

      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No donation data available
      </div>

    ) : (

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={data.monthlyDonations}
        >

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value: number) =>
              [`NPR ${Number(value).toLocaleString()}`, 'Donations']
            }
          />

          <Bar
            dataKey="total"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    )}

  </div>


  {/* PROJECT BUDGET */}

  <div className="bg-white rounded-2xl shadow-md p-6">

    <h2 className="text-xl font-bold mb-6">
      Project Budget
    </h2>

    <div className="space-y-6">

      {/* TOTAL BUDGET */}

      <div className="flex items-center justify-between p-5 bg-blue-50 rounded-xl">

        <div>
          <p className="text-sm text-gray-500">
            Total Project Budget
          </p>

          <p className="text-2xl font-bold text-blue-700 mt-1">
            NPR {data.stats.budget.toLocaleString()}
          </p>
        </div>

        <TrendingUp
          className="text-blue-600"
          size={32}
        />

      </div>


      {/* TOTAL DONATIONS */}

      <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-xl">

        <div>
          <p className="text-sm text-gray-500">
            Total Donations
          </p>

          <p className="text-2xl font-bold text-emerald-700 mt-1">
            NPR {data.stats.donations.toLocaleString()}
          </p>
        </div>

        <Wallet
          className="text-emerald-600"
          size={32}
        />

      </div>


      {/* DIFFERENCE */}

      <div className="flex items-center justify-between p-5 bg-purple-50 rounded-xl">

        <div>
          <p className="text-sm text-gray-500">
            Budget Difference
          </p>

          <p className="text-2xl font-bold text-purple-700 mt-1">
            NPR{' '}
            {(
              data.stats.donations -
              data.stats.budget
            ).toLocaleString()}
          </p>
        </div>

        <TrendingUp
          className="text-purple-600"
          size={32}
        />

      </div>

    </div>

  </div>

</div>
        </div>

        <TrendingUp
          className="text-purple-600"
          size={32}
        />

      </div>

    </div>

  </div>

</div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* MONTHLY ACTIVITIES */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-4">
              Monthly Activities
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={data.monthlyActivities}
              >

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#4F46E5"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* BENEFICIARY GENDER */}

          <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-4">
              Beneficiaries by Gender
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={data.beneficiaryGender}
                  dataKey="total"
                  nameKey="gender"
                  outerRadius={100}
                  label
                >

                  {data.beneficiaryGender.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
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

        </div>

      </div>

      {/* ==========================
          EDIT MODAL
      ========================== */}

      {editingActivity && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Edit Activity
              </h2>

              <button
                onClick={() =>
                  setEditingActivity(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            {/* TITLE */}

            <div className="mb-5">

              <label className="block text-sm font-medium mb-2">
                Activity Title
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Activity title"
              />

            </div>

            {/* DATE */}

            <div className="mb-6">

              <label className="block text-sm font-medium mb-2">
                Activity Date
              </label>

              <input
                type="date"
                value={editDate}
                onChange={(e) =>
                  setEditDate(e.target.value)
                }
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setEditingActivity(null)
                }
                className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >

                <Save size={18} />

                {saving
                  ? 'Saving...'
                  : 'Save Changes'}

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}