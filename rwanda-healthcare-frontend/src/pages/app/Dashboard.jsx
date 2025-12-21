import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Users,
  Stethoscope,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import { LineChart, BarChart } from "../../components/ui/SimpleCharts";

const cx = (...a) => a.filter(Boolean).join(" ");

function Pill({ children, tone = "blue" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "gray"
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : "bg-sky-50 text-sky-700 border-sky-200";
  return (
    <span className={cx("text-xs font-extrabold rounded-full px-3 py-1 border", cls)}>
      {children}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone = "blue" }) {
  const toneCls =
    tone === "green"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : tone === "amber"
      ? "bg-amber-50 border-amber-100 text-amber-800"
      : tone === "violet"
      ? "bg-violet-50 border-violet-100 text-violet-700"
      : "bg-sky-50 border-sky-100 text-sky-700";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-600">{label}</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">
            {value}
          </div>
          {sub && <div className="text-xs text-slate-500 mt-2">{sub}</div>}
        </div>

        <div className={cx("h-12 w-12 rounded-2xl border flex items-center justify-center", toneCls)}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, right, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold text-slate-900">{title}</div>
          {subtitle && <div className="text-sm text-slate-600 mt-1">{subtitle}</div>}
        </div>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function isoToday() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || "PATIENT";

  const {
    patients = [],
    hospitals = [],
    doctors = [],
    appointments = [],
    medicalRecords = [],
  } = useAppData();

  const today = useMemo(() => isoToday(), []);

  const kpis = useMemo(() => {
    const appointmentsToday = appointments.filter((a) => String(a.date) === today).length;
    const pendingAppointments = appointments.filter((a) => String(a.status) === "pending").length;
    const recordsUpdatedToday = medicalRecords.filter((r) => String(r.date) === today).length;

    return {
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      totalFacilities: hospitals.length,
      appointmentsToday,
      pendingApprovals: pendingAppointments,
      recordsUpdatedToday,
    };
  }, [patients.length, doctors.length, hospitals.length, appointments, medicalRecords, today]);

  const appointmentsByDay = useMemo(() => {
    const days = [6, 5, 4, 3, 2, 1, 0].map((n) => isoDaysAgo(n));
    const labelFor = (iso) => {
      const d = new Date(iso + "T00:00:00");
      const w = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return w[d.getDay()];
    };

    return days.map((iso) => ({
      label: labelFor(iso),
      value: appointments.filter((a) => String(a.date) === iso).length,
    }));
  }, [appointments]);

  const appointmentStatusDistribution = useMemo(() => {
    const statuses = ["pending", "confirmed", "cancelled"];
    return statuses.map((s) => ({
      label: s[0].toUpperCase() + s.slice(1),
      value: appointments.filter((a) => String(a.status) === s).length,
    }));
  }, [appointments]);

  const quickLinks = useMemo(() => {
    if (role === "ADMIN") {
      return [
        { to: "/app/doctors", label: "Manage Doctors" },
        { to: "/app/locations", label: "Manage Locations" },
        { to: "/app/hospitals", label: "Facilities" },
      ];
    }
    if (role === "DOCTOR") {
      return [
        { to: "/app/appointments", label: "My Appointments" },
        { to: "/app/medical-records", label: "Medical Records" },
        { to: "/app/prescriptions", label: "Prescriptions" },
      ];
    }
    return [
      { to: "/app/appointments", label: "My Appointments" },
      { to: "/app/medical-records", label: "My Records" },
      { to: "/app/prescriptions", label: "My Prescriptions" },
    ];
  }, [role]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-7 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-extrabold">
                <Sparkles size={14} /> Live Dashboard
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-3">
                Dashboard <span className="text-white/70 text-base font-bold">({role})</span>
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                Overview of key activity and performance indicators (auto-updating).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold transition"
                >
                  {l.label} <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-7">
          {/* KPI Grid */}
          {role === "ADMIN" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <StatCard
                icon={Users}
                label="Total Patients"
                value={kpis.totalPatients.toLocaleString()}
                sub="Registered in system"
                tone="blue"
              />
              <StatCard
                icon={Stethoscope}
                label="Total Doctors"
                value={kpis.totalDoctors.toLocaleString()}
                sub="Available doctors"
                tone="violet"
              />
              <StatCard
                icon={Building2}
                label="Facilities"
                value={kpis.totalFacilities.toLocaleString()}
                sub="Hospitals available for appointments"
                tone="green"
              />
              <StatCard
                icon={Calendar}
                label="Appointments Today"
                value={kpis.appointmentsToday.toLocaleString()}
                sub={`Date: ${today}`}
                tone="amber"
              />
              <StatCard
                icon={ShieldCheck}
                label="Pending Approvals"
                value={kpis.pendingApprovals.toLocaleString()}
                sub="Pending appointments awaiting confirmation"
                tone="blue"
              />
              <StatCard
                icon={FileText}
                label="Records Updated Today"
                value={kpis.recordsUpdatedToday.toLocaleString()}
                sub={`Date: ${today}`}
                tone="green"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <StatCard icon={Activity} label="Status" value="Active" sub="Secure access enabled" tone="green" />
              <StatCard icon={Calendar} label="Appointments" value="Live" sub="Auto-updating list" tone="blue" />
              <StatCard icon={FileText} label="Records" value="Live" sub="Auto-updating list" tone="violet" />
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      {role === "ADMIN" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Section
            title="Appointments Trend (Last 7 Days)"
            subtitle="Computed from real appointment data"
            right={<Pill>Live</Pill>}
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <LineChart data={appointmentsByDay} />
            </div>
          </Section>

          <Section
            title="Appointment Status Distribution"
            subtitle="Pending vs Confirmed vs Cancelled"
            right={<Pill>Live</Pill>}
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <BarChart data={appointmentStatusDistribution} />
            </div>
          </Section>
        </div>
      )}

      {/* Admin Actions */}
      {role === "ADMIN" && (
        <Section
          title="Admin Controls"
          subtitle="Quick management actions"
          right={<Pill tone="green">Live Data</Pill>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/app/doctors"
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                  <Stethoscope size={18} />
                </div>
                <div className="font-extrabold text-slate-900">Doctors</div>
              </div>
              <p className="text-sm text-slate-600 mt-3">
                View doctors (auto-generated per hospital).
              </p>
              <div className="text-sm font-semibold text-sky-700 mt-4 inline-flex items-center gap-2">
                Open <ArrowRight size={16} />
              </div>
            </Link>

            <Link
              to="/app/hospitals"
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <Building2 size={18} />
                </div>
                <div className="font-extrabold text-slate-900">Facilities</div>
              </div>
              <p className="text-sm text-slate-600 mt-3">Register hospitals (Admin only).</p>
              <div className="text-sm font-semibold text-emerald-700 mt-4 inline-flex items-center gap-2">
                Open <ArrowRight size={16} />
              </div>
            </Link>

            <Link
              to="/app/locations"
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-700">
                  <Users size={18} />
                </div>
                <div className="font-extrabold text-slate-900">Locations</div>
              </div>
              <p className="text-sm text-slate-600 mt-3">Manage location directory.</p>
              <div className="text-sm font-semibold text-violet-700 mt-4 inline-flex items-center gap-2">
                Open <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </Section>
      )}
    </div>
  );
}
