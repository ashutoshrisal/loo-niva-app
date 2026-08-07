'use client';

import CountUp from "react-countup";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "blue" | "green";
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "blue",
}: StatCardProps) {
  const colors =
    accent === "blue"
      ? {
          bg: "bg-blue-100",
          icon: "text-blue-700",
          border: "border-blue-100",
          glow: "hover:shadow-blue-200",
        }
      : {
          bg: "bg-emerald-100",
          icon: "text-emerald-700",
          border: "border-emerald-100",
          glow: "hover:shadow-emerald-200",
        };

return (
    <div
      className={`
        group
        cursor-pointer
        bg-white dark:bg-slate-900
        rounded-3xl
        p-6
        border
        ${colors.border}
        shadow-md
        hover:shadow-2xl
        ${colors.glow}
        hover:-translate-y-2
        transition-all
        duration-500
      `}
    >
      <div className="flex items-center justify-between">

        <div
          className={`
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            ${colors.bg}
            transition-transform
            duration-500
            group-hover:rotate-6
            group-hover:scale-110
          `}
        >
          <Icon className={colors.icon} size={30} />
        </div>

        <ArrowUpRight
          size={20}
          className="text-gray-300 group-hover:text-gray-500 transition"
        />
      </div>

      <h2 className="text-4xl font-extrabold mt-6">

        {typeof value === "number" ? (
          <CountUp
            end={value}
            duration={2}
            separator=","
          />
        ) : (
          value
        )}

      </h2>

      <p className="text-gray-500 mt-2 font-medium">
        {label}
      </p>

      <p className="text-sm text-emerald-600 mt-3 font-semibold">
        ↑ Updated today
      </p>

    </div>
  );
}