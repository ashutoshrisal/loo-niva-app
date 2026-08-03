import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      <div className="relative">

        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isPassword ? <Lock size={18} /> : <Mail size={18} />}
        </div>

        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className="w-full rounded-2xl border border-gray-300 pl-12 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

      </div>
    </div>
  );
}