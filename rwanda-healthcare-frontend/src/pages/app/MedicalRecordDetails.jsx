import React, { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { FileText, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import { useToast } from "../../components/ui/ToastContext";

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="font-extrabold text-slate-900 mt-1">{value || "—"}</div>
    </div>
  );
}

export default function MedicalRecordDetails() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const { toast } = useToast();

  const { medicalRecords, deleteMedicalRecord } = useAppData();

  const item = useMemo(() => medicalRecords.find((r) => r.id === id) || null, [medicalRecords, id]);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(2,6,23,0.08)] p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Record Not Found</h1>
          <Link to="/app/medical-records" className="text-blue-700 hover:underline font-semibold">
            Back to Medical Records
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

  const canDelete = role === "ADMIN" || (role === "DOCTOR" && item.doctorEmail === user?.email);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Medical Record Details</h2>
              <p className="text-sm text-slate-600 mt-1">Clinical record summary and notes.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/app/medical-records"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold hover:bg-slate-50 transition"
            >
              <ArrowLeft size={16} /> Back
            </Link>

            {canDelete && (
              <button
                onClick={() => {
                  if (!window.confirm(`Delete medical record ${item.id}?`)) return;
                  deleteMedicalRecord(item.id);
                  toast(`Medical record ${item.id} deleted.`, { type: "info", title: "Deleted" });
                  window.location.href = "/app/medical-records";
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-2.5 font-semibold hover:bg-red-100 transition"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-sm text-slate-500">Record ID</div>
          <div className="text-lg font-extrabold text-slate-900">{item.id}</div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoTile label="Patient" value={item.patient} />
            <InfoTile label="Doctor" value={item.doctor} />
            <InfoTile label="Date" value={item.date} />
            <InfoTile label="Diagnosis" value={item.diagnosis} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Treatment</div>
            <div className="text-slate-900 font-semibold mt-1">{item.treatment || "—"}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Clinical Notes</div>
            <div className="text-slate-900 font-semibold mt-1 whitespace-pre-wrap">
              {item.notes || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
