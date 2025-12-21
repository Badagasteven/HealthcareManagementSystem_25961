import React, { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Pill, CheckCircle2, XCircle, Download, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import Badge from "../../components/ui/Badge";
import { useToast } from "../../components/ui/ToastContext";

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="font-extrabold text-slate-900 mt-1">{value || "—"}</div>
    </div>
  );
}

export default function PrescriptionDetails() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const { toast } = useToast();

  const { prescriptions, markPrescriptionDispensed, cancelPrescription, deletePrescription } = useAppData();

  const item = useMemo(() => prescriptions.find((p) => p.id === id) || null, [prescriptions, id]);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(2,6,23,0.08)] p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Prescription Not Found</h1>
          <Link to="/app/prescriptions" className="text-blue-700 hover:underline font-semibold">
            Back to Prescriptions
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

  const canDispense =
    (role === "ADMIN" || (role === "DOCTOR" && item.doctorEmail === user?.email)) &&
    item.status === "active";

  const canCancel =
    (role === "ADMIN" || (role === "DOCTOR" && item.doctorEmail === user?.email)) &&
    item.status !== "cancelled";

  const canDelete = role === "ADMIN" || (role === "DOCTOR" && item.doctorEmail === user?.email);

  const tone =
    item.status === "dispensed" ? "confirmed" : item.status === "cancelled" ? "cancelled" : "pending";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Pill size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Prescription Details</h2>
              <p className="text-sm text-slate-600 mt-1">Review, dispense, cancel, or download.</p>
            </div>
          </div>

          <Link
            to="/app/prescriptions"
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
            <div className="text-sm text-slate-500">Prescription ID</div>
            <div className="text-lg font-extrabold text-slate-900">{item.id}</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge tone={tone}>{item.status}</Badge>

            {canDispense && (
              <button
                onClick={() => {
                  markPrescriptionDispensed(item.id);
                  toast(`Prescription ${item.id} marked as dispensed.`, { type: "success", title: "Dispensed" });
                }}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition font-semibold"
              >
                <CheckCircle2 size={16} /> Dispense
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => {
                  cancelPrescription(item.id);
                  toast(`Prescription ${item.id} cancelled.`, { type: "warning", title: "Cancelled" });
                }}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition font-semibold"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => {
                  if (!window.confirm(`Delete prescription ${item.id}?`)) return;
                  deletePrescription(item.id);
                  toast(`Prescription ${item.id} deleted.`, { type: "info", title: "Deleted" });
                  window.location.href = "/app/prescriptions";
                }}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-red-200 bg-white text-red-700 hover:bg-red-50 transition font-semibold"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}

            <button
              onClick={() => toast(`Downloading ${item.id} (demo).`, { type: "info", title: "Download" })}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition font-semibold"
            >
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoTile label="Patient" value={item.patient} />
            <InfoTile label="Doctor" value={item.doctor} />
            <InfoTile label="Medication" value={item.medication} />
            <InfoTile label="Dosage" value={item.dosage} />
            <InfoTile label="Frequency" value={item.frequency || "—"} />
            <InfoTile label="Duration (days)" value={item.durationDays ?? "—"} />
            <InfoTile label="Date Issued" value={item.dateIssued || item.date || "—"} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Instructions</div>
            <div className="text-slate-900 font-semibold mt-1">{item.instructions || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
