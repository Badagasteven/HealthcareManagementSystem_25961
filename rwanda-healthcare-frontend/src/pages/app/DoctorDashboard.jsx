import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import { LineChart } from "../../components/ui/SimpleCharts";

const cx = (...a) => a.filter(Boolean).join(" ");

function Pill({ children, tone = "blue" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-sky-50 text-sky-700 border-sky-200";
  return <span className={cx("text-xs font-extrabold rounded-full px-3 py-1 border", cls)}>{children}</span>;
}

function StatCard({ title, value, icon: Icon, sub, tone = "blue" }) {
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
          <div className="text-sm font-semibold text-slate-600">{title}</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">{value}</div>
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

export default function DoctorDashboard() {
  const { user } = useAuth();
  const myEmail = user?.email || "";
  const today = useMemo(() => isoToday(), []);

  const { appointments = [], medicalRecords = [], patients = [], getDoctorByEmail, hospitals = [] } = useAppData();

  const me = useMemo(() => getDoctorByEmail?.(myEmail) || null, [getDoctorByEmail, myEmail]);

  const myAppointments = useMemo(() => {
    return appointments.filter((a) => String(a.doctorEmail) === String(myEmail));
  }, [appointments, myEmail]);

  const todaysAppointments = useMemo(() => {
    return myAppointments.filter((a) => String(a.date) === today);
  }, [myAppointments, today]);

  const confirmedToday = useMemo(() => {
    return todaysAppointments.filter((a) => String(a.status) === "confirmed").length;
  }, [todaysAppointments]);

  const pendingToday = useMemo(() => {
    return todaysAppointments.filter((a) => String(a.status) === "pending").length;
  }, [todaysAppointments]);

  const patientsUnderCare = useMemo(() => {
    const set = new Set();

    myAppointments.forEach((a) => {
      if (a.patientEmail) set.add(String(a.patientEmail).toLowerCase());
    });

    patients.forEach((p) => {
      if (String(p.doctorEmail) === String(myEmail) && p.email) {
        set.add(String(p.email).toLowerCase());
      }
    });

    return set.size;
  }, [myAppointments, patients, myEmail]);

  const myPendingRecords = useMemo(() => {
    return medicalRecords.filter(
      (r) => String(r.doctorEmail) === String(myEmail) && r.reviewed === false
    );
  }, [medicalRecords, myEmail]);

  const myRecentAppointments = useMemo(() => {
    const sorted = [...myAppointments].sort((a, b) => {
      const aKey = `${a.date || ""} ${a.time || ""}`.trim();
      const bKey = `${b.date || ""} ${b.time || ""}`.trim();
      return aKey.localeCompare(bKey);
    });
    return sorted.slice(0, 5);
  }, [myAppointments]);

  const trendLast7Days = useMemo(() => {
    const days = [6, 5, 4, 3, 2, 1, 0].map((n) => isoDaysAgo(n));
    const labelFor = (iso) => {
      const d = new Date(iso + "T00:00:00");
      const w = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return w[d.getDay()];
    };

    return days.map((iso) => ({
      label: labelFor(iso),
      value: myAppointments.filter((a) => String(a.date) === iso).length,
    }));
  }, [myAppointments]);

  const myHospitalName = me?.hospitalName || null;
  const hospitalInfo = useMemo(() => {
    if (!me?.hospitalId) return null;
    return hospitals.find((h) => String(h.id) === String(me.hospitalId)) || null;
  }, [hospitals, me?.hospitalId]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-7 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-extrabold">
                <Sparkles size={14} /> Doctor Portal
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold mt-3">
                Doctor Dashboard
              </h1>

              <p className="text-white/80 mt-1 text-sm">
                Clinical overview for <b>{user?.name || "Doctor"}</b>
                {myHospitalName ? <> • <span className="text-white/90">{myHospitalName}</span></> : null}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/app/appointments"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold transition"
              >
                My Appointments <ArrowRight size={16} />
              </Link>
              <Link
                to="/app/medical-records"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold transition"
              >
                Records <ArrowRight size={16} />
              </Link>
              <Link
                to="/app/prescriptions"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold transition"
              >
                Prescriptions <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Facility */}
        <div className="p-6 md:p-7">
          {hospitalInfo ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
                <Building2 size={18} />
              </div>
              <div>
                <div className="font-extrabold text-slate-900">{hospitalInfo.name}</div>
                <div className="text-sm text-slate-600 mt-1">
                  {hospitalInfo.district} • {hospitalInfo.province} • {hospitalInfo.category}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              This doctor account is not linked to a hospital record yet. You can still use the system, but you may see 0
              appointments if none are assigned to <b>{myEmail}</b>.
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <StatCard
              title="Today's Appointments"
              value={todaysAppointments.length}
              icon={Calendar}
              sub={`Date: ${today}`}
              tone="amber"
            />
            <StatCard
              title="Patients Under Care"
              value={patientsUnderCare}
              icon={Users}
              sub="Unique patients linked to you"
              tone="blue"
            />
            <StatCard
              title="Pending Records"
              value={myPendingRecords.length}
              icon={FileText}
              sub="Not reviewed yet"
              tone="violet"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <StatCard title="Confirmed Today" value={confirmedToday} icon={CheckCircle2} sub="Confirmed appointments today" tone="green" />
            <StatCard title="Pending Today" value={pendingToday} icon={Clock} sub="Awaiting confirmation today" tone="amber" />
          </div>
        </div>
      </div>

      {/* Trend + list */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Section
          title="My Appointments Trend (Last 7 Days)"
          subtitle="Auto-updating from real appointments assigned to your email."
          right={<Pill>Live</Pill>}
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <LineChart data={trendLast7Days} />
          </div>
        </Section>

        <Section
          title="Upcoming / Recent Appointments"
          subtitle="Top 5 (sorted by date/time)"
          right={<Pill tone="green">Live</Pill>}
        >
          {myRecentAppointments.length === 0 ? (
            <p className="text-sm text-slate-600">No appointments assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {myRecentAppointments.map((a) => (
                <div key={a.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-extrabold text-slate-900">
                        {a.date} • {a.time}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {a.patient} • {a.hospitalName || "—"}
                      </div>
                      <div className="mt-3">
                        <Pill tone={a.status === "confirmed" ? "green" : a.status === "pending" ? "amber" : "blue"}>
                          Status: {a.status}
                        </Pill>
                      </div>
                    </div>

                    <Link
                      to={`/app/appointments/${a.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-900 transition"
                    >
                      View <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
