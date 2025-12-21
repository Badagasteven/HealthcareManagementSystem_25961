import React from "react";
import { User, ShieldCheck, Mail, BadgeCheck } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

function InfoCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-lg font-extrabold text-slate-900 mt-1 truncate">{value}</div>
          {sub ? <div className="text-xs text-slate-500 mt-1">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, role } = useAuth();

  const roleDesc =
    role === "ADMIN"
      ? "Full system access (manage users, hospitals, locations)."
      : role === "DOCTOR"
      ? "Clinical access (manage assigned patients, appointments, records, prescriptions)."
      : "Personal access (view your own appointments, records, prescriptions).";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">My Profile</h2>
              <p className="text-sm text-slate-600 mt-1">Account details and access level</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
            <BadgeCheck size={16} />
            <span className="text-sm font-semibold">Verified Session</span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <InfoCard icon={Mail} label="Email" value={user?.email || "-"} />
        <InfoCard icon={ShieldCheck} label="Role" value={role} sub="Role-based access enforced" />
        <InfoCard icon={User} label="Name" value={user?.name || "User"} />
      </div>

      {/* Summary */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Access Summary</h3>
          <p className="text-sm text-slate-600 mt-1">What you can do in the portal</p>
        </div>
        <div className="p-6">
          <p className="text-slate-700">{roleDesc}</p>
          <p className="text-xs text-slate-500 mt-4">
            Security: OTP (2FA demo) + role-based routing enforced.
          </p>
        </div>
      </div>
    </div>
  );
}
