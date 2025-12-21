import React, { useEffect } from "react";

export default function Modal({ open, title, children, onClose, maxWidth = "max-w-xl" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={[
            "w-full",
            maxWidth,
            "bg-white rounded-3xl shadow-[0_30px_100px_rgba(2,6,23,0.25)] overflow-hidden border border-slate-200",
          ].join(" ")}
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="font-extrabold text-slate-900">{title}</div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
