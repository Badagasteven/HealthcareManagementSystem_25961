import React, { useMemo, useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Plus, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { useAppData } from "../../data/AppDataContext";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../components/ui/ToastContext";

function PageHeader({ icon: Icon, title, subtitle, right }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Icon size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}

export default function Appointments() {
  const { role, user } = useAuth();
  const { toast } = useToast();

  const {
    appointments,
    confirmAppointment,
    cancelAppointment,
    rescheduleAppointment,
    createAppointment,
    patientDirectory,
    doctorDirectory,
    services,
    getServiceById,
  } = useAppData();

  // Status filter
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | confirmed | cancelled

  // Reschedule modal state
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createPatientEmail, setCreatePatientEmail] = useState("");
  const [createDoctorEmail, setCreateDoctorEmail] = useState("");
  const [createServiceId, setCreateServiceId] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [createTime, setCreateTime] = useState("");

  const baseRows = useMemo(() => {
    if (role === "ADMIN") return appointments;
    if (role === "DOCTOR") return appointments.filter((a) => a.doctorEmail === user?.email);
    return appointments.filter((a) => a.patientEmail === user?.email);
  }, [role, user?.email, appointments]);

  const rows = useMemo(() => {
    if (statusFilter === "all") return baseRows;
    return baseRows.filter((a) => a.status === statusFilter);
  }, [baseRows, statusFilter]);

  function canConfirm(a) {
    return (
      (role === "ADMIN" || (role === "DOCTOR" && a.doctorEmail === user?.email)) &&
      a.status !== "confirmed"
    );
  }

  function canCancel(a) {
    if (role === "ADMIN") return a.status !== "cancelled";
    if (role === "DOCTOR") return a.doctorEmail === user?.email && a.status !== "cancelled";
    return a.patientEmail === user?.email && a.status !== "cancelled";
  }

  function canReschedule(a) {
    if (role === "ADMIN") return a.status !== "cancelled";
    if (role === "DOCTOR") return a.doctorEmail === user?.email && a.status !== "cancelled";
    return a.patientEmail === user?.email && a.status !== "cancelled";
  }

  function openReschedule(a) {
    setRescheduleTarget(a);
    setNewDate(a.date || "");
    setNewTime(a.time || "");
    setRescheduleOpen(true);
  }

  function submitReschedule(e) {
    e.preventDefault();
    if (!rescheduleTarget) return;

    rescheduleAppointment(rescheduleTarget.id, { date: newDate, time: newTime });

    toast(`Appointment ${rescheduleTarget.id} rescheduled to ${newDate} at ${newTime}.`, {
      type: "success",
      title: "Rescheduled",
    });

    setRescheduleOpen(false);
    setRescheduleTarget(null);
  }

  function openCreate() {
    const me = (user?.email || "").trim();

    if (role === "PATIENT") {
      setCreatePatientEmail(me);
      const p = patientDirectory.find((x) => x.email === me);
      const assigned = p?.doctorEmail || doctorDirectory[0]?.email || "";
      setCreateDoctorEmail(assigned);
    } else {
      setCreatePatientEmail(patientDirectory[0]?.email || "");
      setCreateDoctorEmail(doctorDirectory[0]?.email || "");
    }

    // ✅ default to first service
    setCreateServiceId(services?.[0]?.id || "");
    setCreateDate("");
    setCreateTime("");
    setCreateOpen(true);
  }

  function submitCreate(e) {
    e.preventDefault();

    const patientEmail = role === "PATIENT" ? user?.email : createPatientEmail;
    const patientObj = patientDirectory.find((p) => p.email === patientEmail);
    const patientName = patientObj?.name || user?.name || patientEmail || "Patient";

    const doctorObj = doctorDirectory.find((d) => d.email === createDoctorEmail);
    const doctorName = doctorObj?.name || createDoctorEmail || "Doctor";

    const svc = createServiceId ? getServiceById?.(createServiceId) : null;

    const created = createAppointment({
      patientEmail,
      patientName,
      doctorEmail: createDoctorEmail,
      doctorName,
      date: createDate,
      time: createTime,
      serviceId: createServiceId || "",
      serviceName: svc?.name || "",
    });

    setCreateOpen(false);

    toast(
      `Created ${created.id} (${created.serviceName || "Service"}) on ${created.date} at ${created.time} (pending).`,
      { type: "success", title: "Appointment created" }
    );
  }

  const columns = useMemo(() => {
    const statusCol = {
      key: "status",
      label: "Status",
      render: (row) => <Badge tone={row.status}>{row.status}</Badge>,
    };

    const actionsCol = {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/app/appointments/${row.id}`} className="text-blue-700 hover:underline font-semibold">
            View
          </Link>

          {canConfirm(row) && (
            <button
              onClick={() => {
                confirmAppointment(row.id);
                toast(`Appointment ${row.id} confirmed.`, { type: "success", title: "Confirmed" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition"
            >
              <CheckCircle2 size={14} /> Confirm
            </button>
          )}

          {canReschedule(row) && (
            <button
              onClick={() => openReschedule(row)}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 transition"
            >
              <Clock size={14} /> Reschedule
            </button>
          )}

          {canCancel(row) && (
            <button
              onClick={() => {
                cancelAppointment(row.id);
                toast(`Appointment ${row.id} cancelled.`, { type: "warning", title: "Cancelled" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition"
            >
              <XCircle size={14} /> Cancel
            </button>
          )}
        </div>
      ),
    };

    const serviceCol = {
      key: "serviceName",
      label: "Service",
      render: (row) => <span>{row.serviceName || "—"}</span>,
    };

    if (role === "PATIENT") {
      return [
        { key: "id", label: "Appointment ID" },
        serviceCol,
        { key: "doctor", label: "Doctor" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        statusCol,
        actionsCol,
      ];
    }
    if (role === "DOCTOR") {
      return [
        { key: "id", label: "Appointment ID" },
        serviceCol,
        { key: "patient", label: "Patient" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        statusCol,
        actionsCol,
      ];
    }
    return [
      { key: "id", label: "Appointment ID" },
      serviceCol,
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "date", label: "Date" },
      { key: "time", label: "Time" },
      statusCol,
      actionsCol,
    ];
  }, [role, user?.email, toast, confirmAppointment, cancelAppointment]);

  const canCreate = role === "ADMIN" || role === "PATIENT";

  const subtitle =
    role === "ADMIN"
      ? "All appointments in the system."
      : role === "DOCTOR"
      ? "Appointments assigned to you."
      : "Your personal appointments.";

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Calendar}
        title="Appointments"
        subtitle={subtitle}
        right={
          canCreate ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} /> New Appointment
            </button>
          ) : null
        }
      />

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="text-blue-600" size={18} />
            <div>
              <div className="font-extrabold text-slate-900">Filters</div>
              <div className="text-sm text-slate-600">Refine appointments by status.</div>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Showing <span className="font-extrabold text-slate-900">{rows.length}</span> appointment(s)
          </div>
        </div>

        <div className="p-6 flex items-center gap-3 flex-wrap">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Appointments Registry</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter by columns, and paginate.</p>
        </div>
        <div className="p-2">
          <DataTable title="Appointments" columns={columns} rows={rows} initialPageSize={5} />
        </div>
      </div>

      {/* Reschedule modal */}
      <Modal
        open={rescheduleOpen}
        title={rescheduleTarget ? `Reschedule ${rescheduleTarget.id}` : "Reschedule"}
        onClose={() => setRescheduleOpen(false)}
      >
        <form onSubmit={submitReschedule} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Choose a new date/time. Status becomes <b>pending</b> until confirmed.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">New Date</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">New Time</label>
              <input
                type="time"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRescheduleOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Create modal */}
      <Modal open={createOpen} title="Create Appointment" onClose={() => setCreateOpen(false)}>
        <form onSubmit={submitCreate} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            New appointments are created as <b>pending</b>.
          </div>

          {role === "ADMIN" && (
            <div>
              <label className="text-sm font-semibold text-slate-700">Patient</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                value={createPatientEmail}
                onChange={(e) => setCreatePatientEmail(e.target.value)}
                required
              >
                {patientDirectory.map((p) => (
                  <option key={p.email} value={p.email}>
                    {p.name} — {p.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-700">Service</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={createServiceId}
              onChange={(e) => setCreateServiceId(e.target.value)}
              required
            >
              {(services || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.category} (RWF {s.priceRwf})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Doctor</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={createDoctorEmail}
              onChange={(e) => setCreateDoctorEmail(e.target.value)}
              required
            >
              {doctorDirectory.map((d) => (
                <option key={d.email} value={d.email}>
                  {d.name} — {d.email}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Date</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
                value={createDate}
                onChange={(e) => setCreateDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Time</label>
              <input
                type="time"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
                value={createTime}
                onChange={(e) => setCreateTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
