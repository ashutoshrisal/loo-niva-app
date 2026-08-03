'use client';

import { useState } from 'react';
import {
  Calendar,
  FileText,
  Filter,
} from 'lucide-react';

export default function ReportGenerator() {
  const [type, setType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  function generateReport() {
    alert(
      `Generating ${type} report\n\nFrom: ${startDate || 'Beginning'}\nTo: ${endDate || 'Today'}`
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="flex items-center gap-3 mb-8">

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <Filter className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Report Generator
          </h2>

          <p className="text-gray-500">
            Generate organization reports with custom filters.
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-4 gap-6">

        <div>

          <label className="block mb-2 font-medium">
            Report Type
          </label>

          <select
            className="w-full border rounded-xl p-3"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="monthly">
              Monthly Report
            </option>

            <option value="quarterly">
              Quarterly Report
            </option>

            <option value="half_yearly">
              Half Yearly Report
            </option>

            <option value="annual">
              Annual Report
            </option>

            <option value="financial">
              Financial Report
            </option>

            <option value="impact">
              Impact Report
            </option>

            <option value="activities">
              Activities Report
            </option>

            <option value="projects">
              Projects Report
            </option>

          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Start Date
          </label>

          <div className="relative">

            <Calendar
              size={18}
              className="absolute left-3 top-4 text-gray-400"
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full border rounded-xl pl-10 p-3"
            />

          </div>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            End Date
          </label>

          <div className="relative">

            <Calendar
              size={18}
              className="absolute left-3 top-4 text-gray-400"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="w-full border rounded-xl pl-10 p-3"
            />

          </div>

        </div>

        <div className="flex items-end">

          <button
            onClick={generateReport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition"
          >
            <FileText size={20} />
            Generate Report
          </button>

        </div>

      </div>

    </div>
  );
}