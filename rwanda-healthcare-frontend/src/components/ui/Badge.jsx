import React from "react";

const tones = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  warning: "bg-orange-50 text-orange-800 border-orange-200",
  default: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function Badge({ children, tone = "default", className = "" }) {
  const cls = tones[tone] || tones.default;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
        "shadow-[0_1px_0_rgba(2,6,23,0.04)]",
        cls,
        className,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {children}
    </span>
  );
}
