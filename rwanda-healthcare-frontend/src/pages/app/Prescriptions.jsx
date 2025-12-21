import React, { useMemo, useState } from "react";
import { Pill, CheckCircle2, XCircle, Download, Plus, Pencil, Trash2, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { useAppData } from "../../data/AppDataContext";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/ToastContext";

function statusTone(status) {
  if (status === "dispensed") return "confirmed";
  if (status === "cancelled") return "cancelled";
  if (status === "active") return "info";
  return "pending";
}

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

export default function Prescriptions() {
  const { role, user } = useAuth();
  const { toast } = useToast();

  const {
    prescriptions,
    patientDirectory,
    doctorDirectory,
    createPrescription,
    updatePrescription,
    deletePrescription,
    markPrescriptionDispensed,
    cancelPrescription,
  } = useAppData();

  const canWrite = role === "ADMIN" || role === "DOCTOR";
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | dispensed | cancelled

  // Create/Edit modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [patientEmail, setPatientEmail] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("1x/day");
  const [durationDays, setDurationDays] = useState("7");
  const [dateIssued, setDateIssued] = useState("");
  const [instructions, setInstructions] = useState("");

  function resetForm() {
    setEditing(null);

    const defaultPatient = patientDirectory?.[0]?.email || "";
    const defaultDoctor =
      role === "DOCTOR" ? (user?.email || "") : (doctorDirectory?.[0]?.email || "");

    setPatientEmail(defaultPatient);
    setDoctorEmail(defaultDoctor);

    setMedication("");
    setDosage("");
    setFrequency("1x/day");
    setDurationDays("7");
    setDateIssued(new Date().toISOString().slice(0, 10));
    setInstructions("");
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);

    setPatientEmail(row.patientEmail || "");
    setDoctorEmail(role === "DOCTOR" ? (user?.email || row.doctorEmail || "") : (row.doctorEmail || ""));
    setMedication(row.medication || "");
    setDosage(row.dosage || "");
    setFrequency(row.frequency || "1x/day");
    setDurationDays(String(row.durationDays ?? ""));
    setDateIssued((row.dateIssued || row.date || "").slice(0, 10));
    setInstructions(row.instructions || "");

    setOpen(true);
  }

  const baseRows = useMemo(() => {
    if (role === "ADMIN") return prescriptions;
    if (role === "DOCTOR") return prescriptions.filter((p) => p.doctorEmail === user?.email);
    return prescriptions.filter((p) => p.patientEmail === user?.email);
  }, [role, user?.email, prescriptions]);

  const rows = useMemo(() => {
    if (statusFilter === "all") return baseRows;
    return baseRows.filter((p) => p.status === statusFilter);
  }, [baseRows, statusFilter]);

  function canDispense(row) {
    return (role === "ADMIN" || (role === "DOCTOR" && row.doctorEmail === user?.email)) && row.status === "active";
  }

  function canCancel(row) {
    return (role === "ADMIN" || (role === "DOCTOR" && row.doctorEmail === user?.email)) && row.status !== "cancelled";
  }

  function canEdit(row) {
    if (!canWrite) return false;
    if (role === "DOCTOR" && row.doctorEmail !== user?.email) return false;
    return row.status !== "dispensed"; // lock edits after dispense
  }

  function canDelete(row) {
    if (!canWrite) return false;
    if (role === "DOCTOR" && row.doctorEmail !== user?.email) return false;
    return true;
  }

  function submitForm(e) {
    e.preventDefault();

    try {
      const patient = patientDirectory.find((p) => p.email === patientEmail);
      const doctor = doctorDirectory.find((d) => d.email === doctorEmail);

      const payload = {
        patientEmail,
        patientName: patient?.name || patientEmail,
        doctorEmail,
        doctorName: doctor?.name || doctorEmail,
        medication: medication.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        durationDays: durationDays === "" ? "" : Number(durationDays),
        instructions: instructions.trim(),
        dateIssued,
      };

      if (editing) {
        updatePrescription(editing.id, {
          ...payload,
          patient: payload.patientName,
          doctor: payload.doctorName,
          date: payload.dateIssued,
        });
        toast(`Prescription ${editing.id} updated.`, { type: "success", title: "Updated" });
      } else {
        const created = createPrescription(payload);
        updatePrescription(created.id, {
          date: created.date || created.dateIssued || dateIssued,
          dateIssued: created.dateIssued || dateIssued,
        });
        toast(`Prescription ${created.id} created.`, { type: "success", title: "Created" });
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast(err?.message || "Failed to save prescription.", { type: "error", title: "Error" });
    }
  }

  const columns = useMemo(() => {
    const statusCol = {
      key: "status",
      label: "Status",
      render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
    };

    const dateCol = {
      key: "date",
      label: "Date",
      render: (row) => <span>{row.date || row.dateIssued || "—"}</span>,
    };

    const actionsCol = {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/app/prescriptions/${row.id}`} className="text-blue-700 hover:underline font-semibold">
            View
          </Link>

          {canEdit(row) && (
            <button
              onClick={() => openEdit(row)}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              <Pencil size={14} /> Edit
            </button>
          )}

          {canDispense(row) && (
            <button
              onClick={() => {
                markPrescriptionDispensed(row.id);
                toast(`Prescription ${row.id} marked as dispensed.`, { type: "success", title: "Dispensed" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition"
            >
              <CheckCircle2 size={14} /> Dispense
            </button>
          )}

          {canCancel(row) && (
            <button
              onClick={() => {
                cancelPrescription(row.id);
                toast(`Prescription ${row.id} cancelled.`, { type: "warning", title: "Cancelled" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <XCircle size={14} /> Cancel
            </button>
          )}

          {canDelete(row) && (
            <button
              onClick={() => {
                if (!window.confirm(`Delete prescription ${row.id}?`)) return;
                deletePrescription(row.id);
                toast(`Prescription ${row.id} deleted.`, { type: "info", title: "Deleted" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}

          <button
            onClick={() => toast(`Downloading ${row.id} (demo).`, { type: "info", title: "Download" })}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition"
          >
            <Download size={14} /> Download
          </button>
        </div>
      ),
    };

    if (role === "PATIENT") {
      return [
        { key: "id", label: "Prescription ID" },
        { key: "doctor", label: "Doctor" },
        { key: "medication", label: "Medication" },
        { key: "dosage", label: "Dosage" },
        dateCol,
        statusCol,
        actionsCol,
      ];
    }

    if (role === "DOCTOR") {
      return [
        { key: "id", label: "Prescription ID" },
        { key: "patient", label: "Patient" },
        { key: "medication", label: "Medication" },
        { key: "dosage", label: "Dosage" },
        dateCol,
        statusCol,
        actionsCol,
      ];
    }

    return [
      { key: "id", label: "Prescription ID" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "medication", label: "Medication" },
      { key: "dosage", label: "Dosage" },
      dateCol,
      statusCol,
      actionsCol,
    ];
  }, [role, user?.email, toast, canWrite, patientDirectory, doctorDirectory]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Pill}
        title="Prescriptions"
        subtitle={
          role === "ADMIN"
            ? "Manage all prescriptions in the system (create, edit, dispense, cancel)."
            : role === "DOCTOR"
            ? "Prescriptions issued by you. You can manage and dispense."
            : "Your personal prescriptions (view only)."
        }
        right={
          canWrite ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} /> New Prescription
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
              <div className="text-sm text-slate-600">Refine prescriptions by status.</div>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Showing <span className="font-extrabold text-slate-900">{rows.length}</span> prescription(s)
          </div>
        </div>

        <div className="p-6 flex items-center gap-3 flex-wrap">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="dispensed">Dispensed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Prescription Registry</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter by columns, and paginate.</p>
        </div>
        <div className="p-2">
          <DataTable title="Prescriptions" columns={columns} rows={rows} initialPageSize={5} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? `Edit Prescription (${editing.id})` : "Create Prescription"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editing ? "Update prescription details." : "Create a new prescription."} Status starts as{" "}
            <b>active</b>.
          </div>

          {(role === "ADMIN" || role === "DOCTOR") && (
            <div>
              <label className="text-sm font-semibold text-slate-700">Patient</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
              >
                {(patientDirectory || []).map((p) => (
                  <option key={p.email} value={p.email}>
                    {p.name} — {p.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "ADMIN" && (
            <div>
              <label className="text-sm font-semibold text-slate-700">Doctor</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                required
              >
                {(doctorDirectory || []).map((d) => (
                  <option key={d.email} value={d.email}>
                    {d.name} — {d.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "DOCTOR" && (
            <div className="text-sm text-slate-600">
              <b>Doctor:</b> {user?.email}
            </div>
          )}

          <Input label="Medication" value={medication} onChange={(e) => setMedication(e.target.value)} required />
          <Input label="Dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 500mg" required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g., 2x/day"
              required
            />
            <Input
              label="Duration (days)"
              type="number"
              min="0"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Date Issued</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
              value={dateIssued}
              onChange={(e) => setDateIssued(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Instructions</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g., Take after meals. Avoid alcohol."
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
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
              {editing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
