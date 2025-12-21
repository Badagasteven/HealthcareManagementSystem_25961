import React from "react";

export default function Input({
  label,
  className = "",
  error,
  hint,
  leftIcon: LeftIcon,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <LeftIcon size={16} />
          </div>
        )}

        <input
          className={[
            "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none",
            "focus:ring-2 focus:ring-blue-200 focus:border-blue-300",
            "placeholder:text-slate-400",
            LeftIcon ? "pl-10" : "",
            error ? "border-rose-300 focus:ring-rose-200 focus:border-rose-300" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>

      {hint && !error && <div className="text-xs text-slate-500">{hint}</div>}
      {error && <div className="text-xs font-semibold text-rose-700">{error}</div>}
    </div>
  );
}
