'use client';

import {
  Download,
  FileSpreadsheet,
  Printer,
  FileText,
} from 'lucide-react';

export default function ExportButtons() {
  function comingSoon(feature: string) {
    alert(`${feature} will be connected to the backend in the next step.`);
  }

  const buttons = [
    {
      title: 'Export PDF',
      description: 'Generate professional NGO reports in PDF format.',
      icon: FileText,
      color: 'bg-red-600 hover:bg-red-700',
      action: () => comingSoon('PDF Export'),
    },
    {
      title: 'Export Excel',
      description: 'Download complete data in Excel format.',
      icon: FileSpreadsheet,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => comingSoon('Excel Export'),
    },
    {
      title: 'Print Report',
      description: 'Print organization reports instantly.',
      icon: Printer,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => window.print(),
    },
    {
      title: 'Download All',
      description: 'Download every available report.',
      icon: Download,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => comingSoon('Complete Report Package'),
    },
  ];

  return (
    <div>

      <h2 className="text-3xl font-bold mb-6">
        Export Center
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        {buttons.map((button) => {
          const Icon = button.icon;

          return (
            <div
              key={button.title}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition p-6"
            >
              <div
                className={`${button.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5`}
              >
                <Icon size={28} />
              </div>

              <h3 className="text-xl font-bold">
                {button.title}
              </h3>

              <p className="text-gray-500 mt-3 mb-6">
                {button.description}
              </p>

              <button
                onClick={button.action}
                className={`${button.color} text-white rounded-xl px-5 py-3 w-full font-semibold transition`}
              >
                Open
              </button>
            </div>
          );
        })}

      </div>

    </div>
  );
}