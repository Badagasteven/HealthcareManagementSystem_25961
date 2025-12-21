import React, { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Shield, User, Phone, MapPin, Mail, PencilLine, ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../components/ui/ToastContext";

const INSURANCE_OPTIONS = [
  "Mutuelle de Santé (CBHI)",
  "RSSB - Rama",
  "MMI",
  "Britam",
  "Radiant",
  "Sanlam",
  "Prime Insurance",
  "UAP Old Mutual",
  "Private / Self-pay",
];

function InfoTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="font-extrabold text-slate-900 truncate">{value}</div>
        {sub ? <div className="text-xs text-slate-500 mt-1">{sub}</div> : null}
      </div>
    </div>
  );
}

export default function PatientDetails() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const { toast } = useToast();
  const { getPatientById, updatePatient } = useAppData();

  const patient = useMemo(() => getPatientById(id), [getPatientById, id]);

  const allowed = useMemo(() => {
    if (!patient) return false;
    if (role === "ADMIN") return true;
    if (role === "DOCTOR") return String(patient.doctorEmail || "") === String(user?.email || "");
    if (role === "PATIENT") return String(patient.email || "").toLowerCase() === String(user?.email || "").toLowerCase();
    return false;
  }, [role, user?.email, patient]);

  const [editOpen, setEditOpen] = useState(false);
  const [insurance, setInsurance] = useState(patient?.insurance || "Mutuelle de Santé (CBHI)");

  if (!patient) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(2,6,23,0.08)] p-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Patient Not Found</h1>
          <Link to="/app/patients" className="text-blue-700 hover:underline font-semibold">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  if (!allowed) return <Navigate to="/app/unauthorized" replace />;

  const canEditInsurance = role === "ADMIN";

  function openEdit() {
    setInsurance(patient.insurance || "Mutuelle de Santé (CBHI)");
    setEditOpen(true);
  }

  function saveInsurance(e) {
    e.preventDefault();
    try {
      updatePatient(patient.id, { insurance });
      toast("Insurance updated successfully.", { type: "success", title: "Updated" });
      setEditOpen(false);
    } catch (err) {
      toast(err?.message || "Failed to update insurance", { type: "error", title: "Error" });
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Patient Details</h2>
          <p className="text-sm text-slate-600 mt-1">View profile + insurance information.</p>
        </div>

        <Link
          to="/app/patients"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold hover:bg-slate-50 transition"
        >
          <ArrowLeft size={16} /> Back to Patients
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-sm text-slate-500">Patient ID</div>
            <div className="text-lg font-extrabold text-slate-900">{patient.id}</div>
          </div>

          {canEditInsurance && (
            <button
              onClick={openEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
              <PencilLine size={16} /> Edit Insurance
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoTile icon={User} label="Name" value={patient.name} sub={`Age: ${patient.age ?? "—"}`} />
            <InfoTile icon={Mail} label="Email" value={patient.email} />
            <InfoTile icon={Phone} label="Phone" value={patient.phone || "—"} />
            <InfoTile icon={MapPin} label="Address" value={patient.address || "—"} sub={`District: ${patient.district || "—"}`} />

            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-500">Insurance</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {patient.insurance || "Not provided"}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Insurance is used when creating appointments and appears in appointment details.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={editOpen} title={`Edit Insurance — ${patient.name}`} onClose={() => setEditOpen(false)}>
        <form onSubmit={saveInsurance} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Insurance</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              required
            >
              {INSURANCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">This change will be saved for this patient profile.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
