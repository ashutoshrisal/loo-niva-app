'use client';

import {
  FileText,
  Eye,
  Download,
  Printer,
} from 'lucide-react';

const reports = [
  {
    title: 'Annual Organization Report',
    description:
      'Complete yearly summary of organizational activities, finances and achievements.',
  },
  {
    title: 'Financial Report',
    description:
      'Budget allocation, utilization and financial overview.',
  },
  {
    title: 'Project Performance Report',
    description:
      'Status, progress and performance of all NGO projects.',
  },
  {
    title: 'Beneficiary Report',
    description:
      'Complete beneficiary statistics and demographic analysis.',
  },
  {
    title: 'Activities Report',
    description:
      'All conducted activities with participation and outcomes.',
  },
  {
    title: 'Donor Contribution Report',
    description:
      'Sponsors, donations and funding history.',
  },
  {
    title: 'School Partnership Report',
    description:
      'Partner schools and educational support analysis.',
  },
  {
    title: 'Impact Assessment Report',
    description:
      'Overall impact created by Loo Niva Child Concern Group.',
  },
];

export default function ReportList() {
  function action(name: string, action: string) {
    alert(`${action} for "${name}" will be connected to the backend.`);
  }

  return (
    <div>

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-3xl font-bold">
            Organization Reports
          </h2>

          <p className="text-gray-500 mt-2">
            Access all official NGO reports from one place.
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {reports.map((report) => (
          <div
            key={report.title}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-7"
          >

            <div className="flex gap-5">

              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                <FileText
                  size={30}
                  className="text-blue-700"
                />

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  {report.title}
                </h3>

                <p className="text-gray-500 mt-2">
                  {report.description}
                </p>

              </div>

            </div>

            <div className="grid grid-cols-4 gap-3 mt-8">

              <button
                onClick={() =>
                  action(report.title, 'Preview')
                }
                className="bg-blue-50 hover:bg-blue-100 rounded-xl py-3 flex flex-col items-center gap-2 transition"
              >
                <Eye
                  size={20}
                  className="text-blue-700"
                />
                <span className="text-sm font-medium">
                  View
                </span>
              </button>

              <button
                onClick={() =>
                  action(report.title, 'PDF Export')
                }
                className="bg-red-50 hover:bg-red-100 rounded-xl py-3 flex flex-col items-center gap-2 transition"
              >
                <Download
                  size={20}
                  className="text-red-600"
                />
                <span className="text-sm font-medium">
                  PDF
                </span>
              </button>

              <button
                onClick={() =>
                  action(report.title, 'Excel Export')
                }
                className="bg-green-50 hover:bg-green-100 rounded-xl py-3 flex flex-col items-center gap-2 transition"
              >
                <Download
                  size={20}
                  className="text-green-600"
                />
                <span className="text-sm font-medium">
                  Excel
                </span>
              </button>

              <button
                onClick={() => window.print()}
                className="bg-purple-50 hover:bg-purple-100 rounded-xl py-3 flex flex-col items-center gap-2 transition"
              >
                <Printer
                  size={20}
                  className="text-purple-700"
                />
                <span className="text-sm font-medium">
                  Print
                </span>
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}