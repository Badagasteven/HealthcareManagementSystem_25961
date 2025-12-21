import React from "react";
import { useToast } from "./ToastContext";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

export default function Toasts() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] w-[min(420px,calc(100vw-2rem))] space-y-3">
      {toasts.map((t) => {
        const Icon = iconMap[t.type] || Info;
        const tone = styleMap[t.type] || styleMap.info;

        return (
          <div
            key={t.id}
            className={[
              "rounded-2xl border",
              "shadow-[0_20px_70px_rgba(2,6,23,0.12)]",
              "backdrop-blur-[2px]",
              "px-4 py-3",
              tone,
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                {t.title && (
                  <div className="font-extrabold text-sm mb-1 leading-snug">{t.title}</div>
                )}
                <div className="text-sm font-semibold leading-snug break-words">
                  {t.message}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="h-9 w-9 rounded-xl border border-slate-200 bg-white/60 hover:bg-white transition text-slate-700 flex items-center justify-center"
                aria-label="Close"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
