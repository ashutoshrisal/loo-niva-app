'use client';

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

interface Props {
  gradeData: any[];
  genderData: any[];
  countryData: any[];
  schoolData: any[];
}

const COLORS = [
  '#2563EB',
  '#16A34A',
  '#F59E0B',
  '#DC2626',
  '#7C3AED',
  '#0891B2',
  '#EA580C',
];

export default function DashboardCharts({
  gradeData,
  genderData,
  countryData,
  schoolData,
}: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Students by Grade */}

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Students by Grade
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Students by Gender */}

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Students by Gender
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>

            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {genderData.map((_, index) => (
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

      </div>

      {/* Sponsors by Country */}

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Sponsors by Country
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#16A34A"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Students per School */}

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">
          Students per School
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={schoolData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#F59E0B"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}