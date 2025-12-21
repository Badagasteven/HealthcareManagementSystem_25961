import React, { useMemo, useState } from "react";
import { Stethoscope, Plus, Pencil, Trash2, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/ToastContext";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";

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

export default function Doctors() {
  const { role } = useAuth();
  const { toast } = useToast();
  const { doctors, hospitals, createDoctor, updateDoctor, deleteDoctor, getHospitalById } = useAppData();

  const isAdmin = role === "ADMIN";

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospitalId, setHospitalId] = useState(hospitals?.[0]?.id || "");

  const [hospitalFilter, setHospitalFilter] = useState("all");

  function resetForm() {
    setName("");
    setEmail("");
    setSpecialty("");
    setHospitalId(hospitals?.[0]?.id || "");
    setEditing(null);
  }

  function openCreate() {
    if (!hospitals?.length) {
      toast("No hospitals found. Admin must register hospitals first.", { type: "warning", title: "Hospitals" });
      return;
    }
    resetForm();
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setName(row.name || "");
    setEmail(row.email || "");
    setSpecialty(row.specialty || "");
    setHospitalId(row.hospitalId || hospitals?.[0]?.id || "");
    setOpen(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        updateDoctor(editing.id, { name, email, specialty, hospitalId });
        toast(`Doctor ${editing.id} updated.`, { type: "success", title: "Updated" });
      } else {
        const created = createDoctor({ name, email, specialty, hospitalId });
        toast(`Doctor ${created.id} created.`, { type: "success", title: "Created" });
      }
      setOpen(false);
      resetForm();
    } catch (err) {
      toast(err?.message || "Failed to save doctor.", { type: "error", title: "Error" });
    }
  }

  const rows = useMemo(() => {
    const mapped = doctors.map((d) => {
      const h = getHospitalById?.(d.hospitalId);
      return {
        ...d,
        hospitalName: h?.name || "—",
        district: h?.district || "—",
        province: h?.province || "—",
        category: h?.category || "—",
      };
    });

    if (hospitalFilter === "all") return mapped;
    return mapped.filter((d) => d.hospitalId === hospitalFilter);
  }, [doctors, getHospitalById, hospitalFilter]);

  const columns = useMemo(() => {
    const cols = [
      { key: "id", label: "Doctor ID" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "specialty", label: "Specialty" },
      { key: "hospitalName", label: "Hospital" },
      { key: "district", label: "District" },
      { key: "province", label: "Province" },
    ];

    if (isAdmin) {
      cols.push({
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openEdit(row)}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => {
                if (!window.confirm(`Delete doctor ${row.id}?`)) return;
                deleteDoctor(row.id);
                toast(`Doctor ${row.id} deleted.`, { type: "info", title: "Deleted" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ),
      });
    }

    return cols;
  }, [isAdmin, deleteDoctor, toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Stethoscope}
        title="Doctors"
        subtitle={isAdmin ? "Manage doctors and assign them to hospitals." : "View doctors directory."}
        right={
          isAdmin ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} />
              Add Doctor
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
              <div className="text-sm text-slate-600">Refine doctors by hospital.</div>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Showing <span className="font-extrabold text-slate-900">{rows.length}</span> doctor(s)
          </div>
        </div>

        <div className="p-6 flex items-center gap-3 flex-wrap">
          <label className="text-sm font-semibold text-slate-700">Hospital</label>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
          >
            <option value="all">All hospitals</option>
            {(hospitals || []).map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.district}, {h.province}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Doctors Directory</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter by columns, and paginate.</p>
        </div>
        <div className="p-2">
          <DataTable title="Doctors Directory" columns={columns} rows={rows} initialPageSize={10} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? `Edit Doctor (${editing.id})` : "Add Doctor"}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editing ? "Update doctor profile and hospital assignment." : "Create a new doctor profile."}
          </div>

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dr. Uwimana Grace"
            required
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., grace@health.rw"
            required
          />
          <Input
            label="Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g., Pediatrics"
            required
          />

          <div>
            <label className="text-sm font-semibold text-slate-700">Assigned Hospital</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              required
            >
              {(hospitals || []).map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.district}, {h.province} ({h.category})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editing ? "Save Changes" : "Create Doctor"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
