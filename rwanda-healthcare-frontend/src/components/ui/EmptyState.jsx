import React from "react";
import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "No results found",
  desc = "Try changing your filters or search keywords.",
  action,
  icon: Icon = SearchX,
}) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
        <Icon size={22} />
      </div>
      <div className="mt-4 text-slate-900 font-extrabold">{title}</div>
      {desc && <div className="text-sm text-slate-600 mt-1">{desc}</div>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
