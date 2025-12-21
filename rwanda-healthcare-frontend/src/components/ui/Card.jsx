import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right, className = "" }) {
  return (
    <div
      className={[
        "px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 flex-wrap",
        className,
      ].join(" ")}
    >
      <div>
        <div className="font-extrabold text-slate-900">{title}</div>
        {subtitle && <div className="text-sm text-slate-600 mt-1">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
