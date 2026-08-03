import React from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  children,
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        w-full
        flex
        items-center
        justify-center
        gap-2
        bg-blue-600
        hover:bg-blue-700
        active:scale-95
        transition-all
        duration-200
        text-white
        font-semibold
        rounded-2xl
        py-3
        shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
      <ArrowRight size={18} />
    </button>
  );
}