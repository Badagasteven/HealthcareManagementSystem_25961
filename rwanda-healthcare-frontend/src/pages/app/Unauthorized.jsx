import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export default function Unauthorized() {
  const { getDefaultAppPath, role } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(2,6,23,0.08)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Unauthorized</h1>
              <p className="text-sm text-slate-600 mt-1">
                You don’t have permission to access that page with your current role:{" "}
                <span className="font-semibold text-slate-900">{role}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-3">
            <Link
              to={getDefaultAppPath(role)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <Link
              to="/app/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              My Profile
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Security note: role-based routing is enforced across the app.
          </p>
        </div>
      </div>
    </div>
  );
}
