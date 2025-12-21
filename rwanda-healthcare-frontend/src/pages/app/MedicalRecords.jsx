import React, { useMemo, useState } from "react";
import { FileText, Plus, Pencil, Trash2, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/ToastContext";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";
import { Link } from "react-router-dom";

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

export default function MedicalRecords() {
  const { role, user } = useAuth();
  const { toast } = useToast();

  const {
    medicalRecords,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    patientDirectory,
    doctorDirectory,
  } = useAppData();

  const canWrite = role === "ADMIN" || role === "DOCTOR";

  // filter panel
  const [doctorFilter, setDoctorFilter] = useState("all");

  // modal state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [patientEmail, setPatientEmail] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [date, setDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [treatment, setTreatment] = useState("");

  function resetForm() {
    setEditing(null);

    const defaultPatient = patientDirectory?.[0]?.email || "";
    const defaultDoctor =
      role === "DOCTOR" ? (user?.email || "") : (doctorDirectory?.[0]?.email || "");

    setPatientEmail(defaultPatient);
    setDoctorEmail(defaultDoctor);

    setDate(new Date().toISOString().slice(0, 10));
    setDiagnosis("");
    setNotes("");
    setTreatment("");
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setPatientEmail(row.patientEmail || "");
    setDoctorEmail(role === "DOCTOR" ? (user?.email || row.doctorEmail || "") : (row.doctorEmail || ""));
    setDate((row.date || "").slice(0, 10));
    setDiagnosis(row.diagnosis || "");
    setNotes(row.notes || "");
    setTreatment(row.treatment || "");
    setOpen(true);
  }

  function submit(e) {
    e.preventDefault();
    try {
      const patient = patientDirectory.find((p) => p.email === patientEmail);
      const doctor = doctorDirectory.find((d) => d.email === doctorEmail);

      const payload = {
        patientEmail,
        patientName: patient?.name || patientEmail,
        doctorEmail,
        doctorName: doctor?.name || doctorEmail,
        date,
        diagnosis: diagnosis.trim(),
        notes: notes.trim(),
        treatment: treatment.trim(),
      };

      if (editing) {
        updateMedicalRecord(editing.id, {
          ...payload,
          patient: payload.patientName,
          doctor: payload.doctorName,
        });
        toast(`Medical record ${editing.id} updated.`, { type: "success", title: "Updated" });
      } else {
        const created = createMedicalRecord(payload);
        toast(`Medical record ${created.id} created.`, { type: "success", title: "Created" });
      }

      setOpen(false);
      setEditing(null);
    } catch (err) {
      toast(err?.message || "Failed to save medical record.", { type: "error", title: "Error" });
    }
  }

  // role-based visibility
  const baseRows = useMemo(() => {
    if (role === "ADMIN") return medicalRecords;
    if (role === "DOCTOR") return medicalRecords.filter((r) => r.doctorEmail === user?.email);
    return medicalRecords.filter((r) => r.patientEmail === user?.email);
  }, [role, user?.email, medicalRecords]);

  const rows = useMemo(() => {
    let out = baseRows;

    // optional admin filter
    if (role === "ADMIN" && doctorFilter !== "all") {
      out = out.filter((r) => r.doctorEmail === doctorFilter);
    }

    return out;
  }, [baseRows, role, doctorFilter]);

  const columns = useMemo(() => {
    const actionsCol = {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Link to={`/app/medical-records/${row.id}`} className="text-blue-700 hover:underline font-semibold">
            View
          </Link>

          {canWrite && (role === "ADMIN" || row.doctorEmail === user?.email) && (
            <button
              onClick={() => openEdit(row)}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              <Pencil size={14} /> Edit
            </button>
          )}

          {canWrite && (role === "ADMIN" || row.doctorEmail === user?.email) && (
            <button
              onClick={() => {
                if (!window.confirm(`Delete medical record ${row.id}?`)) return;
                deleteMedicalRecord(row.id);
                toast(`Medical record ${row.id} deleted.`, { type: "info", title: "Deleted" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      ),
    };

    if (role === "PATIENT") {
      return [
        { key: "id", label: "Record ID" },
        { key: "date", label: "Date" },
        { key: "doctor", label: "Doctor" },
        { key: "diagnosis", label: "Diagnosis" },
        actionsCol,
      ];
    }

    if (role === "DOCTOR") {
      return [
        { key: "id", label: "Record ID" },
        { key: "date", label: "Date" },
        { key: "patient", label: "Patient" },
        { key: "diagnosis", label: "Diagnosis" },
        actionsCol,
      ];
    }

    return [
      { key: "id", label: "Record ID" },
      { key: "date", label: "Date" },
      { key: "patient", label: "Patient" },
      { key: "doctor", label: "Doctor" },
      { key: "diagnosis", label: "Diagnosis" },
      actionsCol,
    ];
  }, [role, canWrite, user?.email, toast, deleteMedicalRecord]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={FileText}
        title="Medical Records"
        subtitle={
          role === "ADMIN"
            ? "Manage all patient medical records."
            : role === "DOCTOR"
            ? "Records for patients assigned to you."
            : "Your medical records (view only)."
        }
        right={
          canWrite ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} /> New Record
            </button>
          ) : null
        }
      />

      {/* Filters */}
      {role === "ADMIN" && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="text-blue-600" size={18} />
              <div>
                <div className="font-extrabold text-slate-900">Filters</div>
                <div className="text-sm text-slate-600">Refine records by doctor.</div>
              </div>
            </div>

            <div className="text-sm text-slate-600">
              Showing <span className="font-extrabold text-slate-900">{rows.length}</span> record(s)
            </div>
          </div>

          <div className="p-6 flex items-center gap-3 flex-wrap">
            <label className="text-sm font-semibold text-slate-700">Doctor</label>
            <select
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="all">All doctors</option>
              {(doctorDirectory || []).map((d) => (
                <option key={d.email} value={d.email}>
                  {d.name} — {d.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Records Registry</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter by columns, and paginate.</p>
        </div>
        <div className="p-2">
          <DataTable title="Medical Records" columns={columns} rows={rows} initialPageSize={5} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? `Edit Record (${editing.id})` : "Create Medical Record"}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editing ? "Update the record details." : "Create a new medical record entry."}
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

          <div>
            <label className="text-sm font-semibold text-slate-700">Date</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Input
            label="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g., Malaria"
            required
          />

          <div>
            <label className="text-sm font-semibold text-slate-700">Treatment</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
              rows={3}
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="e.g., Artemether/Lumefantrine for 3 days"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Clinical Notes</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, vitals, tests, follow-up notes..."
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
