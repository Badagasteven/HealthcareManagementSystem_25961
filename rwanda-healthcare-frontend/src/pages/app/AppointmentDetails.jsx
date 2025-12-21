import React, { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Calendar, CheckCircle2, XCircle, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../components/ui/ToastContext";

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="font-extrabold text-slate-900 mt-1">{value || "—"}</div>
    </div>
  );
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const { toast } = useToast();

  const { appointments, confirmAppointment, cancelAppointment, rescheduleAppointment, getServiceById } =
    useAppData();

  const [open, setOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const item = useMemo(() => appointments.find((a) => a.id === id) || null, [appointments, id]);

  const service = useMemo(() => {
    if (!item?.serviceId) return null;
    return getServiceById?.(item.serviceId) || null;
  }, [item?.serviceId, getServiceById]);

  const estimatedCost = service?.priceRwf ?? null;

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(2,6,23,0.08)] p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Appointment Not Found</h1>
          <Link to="/app/appointments" className="text-blue-700 hover:underline font-semibold">
            Back to Appointments
          </Link>
        </div>
      </div>
    );
  }

  const allowed =
    role === "ADMIN" ||
    (role === "DOCTOR" && item.doctorEmail === user?.email) ||
    (role === "PATIENT" && item.patientEmail === user?.email);

  if (!allowed) return <Navigate to="/app/unauthorized" replace />;

  const canConfirm =
    (role === "ADMIN" || (role === "DOCTOR" && item.doctorEmail === user?.email)) &&
    item.status !== "confirmed";

  const canCancel =
    (role === "ADMIN" ||
      (role === "DOCTOR" && item.doctorEmail === user?.email) ||
      (role === "PATIENT" && item.patientEmail === user?.email)) &&
    item.status !== "cancelled";

  const canReschedule =
    (role === "ADMIN" ||
      (role === "DOCTOR" && item.doctorEmail === user?.email) ||
      (role === "PATIENT" && item.patientEmail === user?.email)) &&
    item.status !== "cancelled";

  function openReschedule() {
    setNewDate(item.date || "");
    setNewTime(item.time || "");
    setOpen(true);
  }

  function submitReschedule(e) {
    e.preventDefault();
    rescheduleAppointment(item.id, { date: newDate, time: newTime });
    toast(`Appointment ${item.id} rescheduled to ${newDate} at ${newTime}.`, {
      type: "success",
      title: "Rescheduled",
    });
    setOpen(false);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Appointment Details</h2>
              <p className="text-sm text-slate-600 mt-1">Review, confirm, reschedule, or cancel.</p>
            </div>
          </div>

          <Link
            to="/app/appointments"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-slate-500">Appointment ID</div>
            <div className="text-lg font-extrabold text-slate-900">{item.id}</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge tone={item.status}>{item.status}</Badge>

            {canConfirm && (
              <button
                onClick={() => {
                  confirmAppointment(item.id);
                  toast(`Appointment ${item.id} confirmed.`, { type: "success", title: "Confirmed" });
                }}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition font-semibold"
              >
                <CheckCircle2 size={16} /> Confirm
              </button>
            )}

            {canReschedule && (
              <button
                onClick={openReschedule}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 transition font-semibold"
              >
                <Clock size={16} /> Reschedule
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => {
                  cancelAppointment(item.id);
                  toast(`Appointment ${item.id} cancelled.`, { type: "warning", title: "Cancelled" });
                }}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition font-semibold"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoTile label="Service" value={item.serviceName || service?.name || "—"} />
            <InfoTile
              label="Estimated Cost"
              value={estimatedCost == null ? "—" : `RWF ${Number(estimatedCost).toLocaleString()}`}
            />
            <InfoTile label="Doctor" value={item.doctor} />
            <InfoTile label="Patient" value={item.patient} />
            <InfoTile label="Date" value={item.date} />
            <InfoTile label="Time" value={item.time} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            Tip: after rescheduling, the appointment returns to <b>pending</b> until confirmed.
          </div>
        </div>
      </div>

      {/* Reschedule modal */}
      <Modal open={open} title={`Reschedule ${item.id}`} onClose={() => setOpen(false)}>
        <form onSubmit={submitReschedule} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Status will become <b>pending</b> until confirmed.
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
              onClick={() => setOpen(false)}
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
    </div>
  );
}
