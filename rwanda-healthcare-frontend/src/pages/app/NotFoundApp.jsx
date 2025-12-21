import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFoundApp() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(2,6,23,0.08)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <SearchX size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
              <p className="text-sm text-slate-600 mt-1">
                The page you’re trying to access does not exist.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <ArrowLeft size={16} />
              Back to App
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Go to Public Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
