import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

const ToastContext = createContext(null);

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const iconByType = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toneByType = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, opts = {}) => {
      const id = uid();
      const type = opts.type || "success"; // success | error | info | warning
      const title = opts.title || null;
      const duration = typeof opts.duration === "number" ? opts.duration : 3200;

      const item = { id, message, title, type };

      setToasts((prev) => [...prev, item]);

      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const value = useMemo(() => ({ toasts, toast, removeToast }), [toasts, toast, removeToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/**
 * Optional viewport. Render once in AppLayout/PublicLayout (near the end of the tree).
 * It uses the same toasts state from ToastProvider.
 */
export function ToastViewport() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed z-[60] top-4 right-4 w-[min(420px,calc(100vw-2rem))] space-y-3">
      {toasts.map((t) => {
        const Icon = iconByType[t.type] || Info;
        const tone = toneByType[t.type] || toneByType.info;

        return (
          <div
            key={t.id}
            className={[
              "rounded-2xl border shadow-[0_20px_70px_rgba(2,6,23,0.12)]",
              "p-4 flex items-start gap-3",
              tone,
            ].join(" ")}
          >
            <div className="mt-0.5">
              <Icon size={18} />
            </div>

            <div className="min-w-0 flex-1">
              {t.title && <div className="font-extrabold">{t.title}</div>}
              <div className="text-sm font-semibold leading-snug break-words">{t.message}</div>
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="h-9 w-9 rounded-xl border border-slate-200 bg-white/60 hover:bg-white transition text-slate-700"
              aria-label="Close toast"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
