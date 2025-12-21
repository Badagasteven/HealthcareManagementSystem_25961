import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Calendar,
  FileText,
  Pill,
  User,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";

const cx = (...a) => a.filter(Boolean).join(" ");

function Chip({ children, tone = "blue" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-sky-50 text-sky-700 border-sky-200";
  return <span className={cx("text-xs font-extrabold rounded-full px-3 py-1 border", cls)}>{children}</span>;
}

function StatCard({ label, value, icon: Icon, sub, tone = "blue" }) {
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

export default function PatientDashboard() {
  const { user, role } = useAuth();
  const email = (user?.email || "").toLowerCase();

  const {
    patients = [],
    appointments = [],
    medicalRecords = [],
    prescriptions = [],
    getPatientByEmail,
    getHospitalById,
  } = useAppData();

  const today = useMemo(() => isoToday(), []);

  const myPatient = useMemo(() => {
    if (!email) return null;
    return (getPatientByEmail ? getPatientByEmail(email) : patients.find((p) => String(p.email).toLowerCase() === email)) || null;
  }, [email, getPatientByEmail, patients]);

  const myAppointments = useMemo(() => {
    if (!email) return [];
    return appointments.filter((a) => String(a.patientEmail).toLowerCase() === email);
  }, [appointments, email]);

  const myRecords = useMemo(() => {
    if (!email) return [];
    return medicalRecords.filter((r) => String(r.patientEmail).toLowerCase() === email);
  }, [medicalRecords, email]);

  const myPrescriptions = useMemo(() => {
    if (!email) return [];
    return prescriptions.filter((p) => String(p.patientEmail).toLowerCase() === email);
  }, [prescriptions, email]);

  const todaysAppointments = useMemo(() => {
    return myAppointments.filter((a) => String(a.date) === today);
  }, [myAppointments, today]);

  const nextAppointment = useMemo(() => {
    const sorted = [...myAppointments].sort((a, b) => {
      const aKey = `${a.date || ""} ${a.time || ""}`.trim();
      const bKey = `${b.date || ""} ${b.time || ""}`.trim();
      return aKey.localeCompare(bKey);
    });
    return sorted[0] || null;
  }, [myAppointments]);

  const myHospital = useMemo(() => {
    if (!nextAppointment?.hospitalId) return null;
    return getHospitalById ? getHospitalById(nextAppointment.hospitalId) : null;
  }, [nextAppointment?.hospitalId, getHospitalById]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-7 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-extrabold">
                <Sparkles size={14} /> Patient Portal
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-3">Patient Dashboard</h2>
              <p className="text-white/80 mt-1 text-sm">
                Welcome, <b>{user?.name || "Patient"}</b> • Role: {role}
              </p>
            </div>

            {myPatient ? (
              <Link
                to={`/app/patients/${myPatient.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold transition"
              >
                <User size={16} /> View My Patient File <ArrowRight size={16} />
              </Link>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-2 text-sm">
                Your patient record is not linked to this account email.
              </div>
            )}
          </div>
        </div>

        {/* Next appointment */}
        <div className="p-6 md:p-7">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="text-sky-700" size={18} />
              <div className="font-extrabold text-slate-900">Next / Upcoming Appointment</div>
            </div>

            <Link
              to="/app/appointments"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-900 transition"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {!nextAppointment ? (
            <p className="text-sm text-slate-600 mt-4">You have no appointments yet.</p>
          ) : (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-extrabold text-slate-900">
                    {nextAppointment.date} • {nextAppointment.time}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    Doctor: <b>{nextAppointment.doctor}</b>
                  </div>
                  <div className="text-sm text-slate-600">
                    Hospital: <b>{nextAppointment.hospitalName || "—"}</b>
                  </div>

                  {myHospital ? (
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                      <Building2 size={14} /> {myHospital.district} • {myHospital.province} • {myHospital.category}
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <Chip tone={nextAppointment.status === "confirmed" ? "green" : nextAppointment.status === "pending" ? "amber" : "blue"}>
                      Status: {nextAppointment.status}
                    </Chip>
                  </div>
                </div>

                <Link
                  to={`/app/appointments/${nextAppointment.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-900 transition"
                >
                  View <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="My Appointments" value={myAppointments.length} icon={Calendar} sub={`${todaysAppointments.length} today`} tone="amber" />
        <StatCard label="My Medical Records" value={myRecords.length} icon={FileText} sub="All records linked to your email" tone="violet" />
        <StatCard label="My Prescriptions" value={myPrescriptions.length} icon={Pill} sub="Active + past prescriptions" tone="green" />
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Recent Appointments" subtitle="Latest 3 appointments" right={<Chip>Live</Chip>}>
          {myAppointments.length === 0 ? (
            <p className="text-sm text-slate-600">No appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {[...myAppointments]
                .sort((a, b) => `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`))
                .slice(0, 3)
                .map((a) => (
                  <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="font-extrabold text-slate-900">
                      {a.date} • {a.time}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {a.doctor} • {a.hospitalName || "—"}
                    </div>
                    <Link
                      to={`/app/appointments/${a.id}`}
                      className="text-sm font-semibold text-sky-700 hover:underline mt-3 inline-block"
                    >
                      View
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </Section>

        <Section title="Recent Records" subtitle="Latest 3 medical records" right={<Chip tone="violet">Live</Chip>}>
          {myRecords.length === 0 ? (
            <p className="text-sm text-slate-600">No records yet.</p>
          ) : (
            <div className="space-y-3">
              {[...myRecords]
                .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
                .slice(0, 3)
                .map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="font-extrabold text-slate-900">{r.diagnosis}</div>
                    <div className="text-sm text-slate-600 mt-1">{r.date}</div>
                    <Link
                      to={`/app/medical-records/${r.id}`}
                      className="text-sm font-semibold text-sky-700 hover:underline mt-3 inline-block"
                    >
                      View
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </Section>

        <Section title="Recent Prescriptions" subtitle="Latest 3 prescriptions" right={<Chip tone="green">Live</Chip>}>
          {myPrescriptions.length === 0 ? (
            <p className="text-sm text-slate-600">No prescriptions yet.</p>
          ) : (
            <div className="space-y-3">
              {[...myPrescriptions]
                .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
                .slice(0, 3)
                .map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="font-extrabold text-slate-900">{p.medication}</div>
                    <div className="text-sm text-slate-600 mt-1">{p.date}</div>
                    <Link
                      to={`/app/prescriptions/${p.id}`}
                      className="text-sm font-semibold text-sky-700 hover:underline mt-3 inline-block"
                    >
                      View
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
