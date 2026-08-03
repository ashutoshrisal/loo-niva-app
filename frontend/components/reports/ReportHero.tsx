'use client';

import {
  FileText,
  Download,
  Printer,
  BarChart3,
} from 'lucide-react';

export default function ReportHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white shadow-2xl">

      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

      <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10 p-10">

        <div>

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
            <BarChart3 size={18} />
            NGO Reporting Center
          </div>

          <h1 className="text-5xl font-extrabold leading-tight">
            Organization
            <br />
            Reports &
            <br />
            Analytics
          </h1>

          <p className="mt-6 text-lg text-white/90 max-w-2xl">
            Generate annual reports, financial summaries,
            project performance, beneficiary statistics,
            donor reports and impact assessments for
            Loo Niva Child Concern Group.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition">
              <FileText size={20} />
              Generate Report
            </button>

            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition">
              <Download size={20} />
              Export PDF
            </button>

            <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition">
              <Printer size={20} />
              Print
            </button>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 text-center">
            <h2 className="text-4xl font-bold">2026</h2>
            <p className="mt-2 text-white/80">
              Annual Report
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 text-center">
            <h2 className="text-4xl font-bold">12</h2>
            <p className="mt-2 text-white/80">
              Monthly Reports
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 text-center">
            <h2 className="text-4xl font-bold">100%</h2>
            <p className="mt-2 text-white/80">
              Export Ready
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 text-center">
            <h2 className="text-4xl font-bold">PDF</h2>
            <p className="mt-2 text-white/80">
              Excel • Print
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}