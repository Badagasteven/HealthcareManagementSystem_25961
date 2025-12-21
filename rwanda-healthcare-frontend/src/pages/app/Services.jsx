import React, { useMemo, useState } from "react";
import { BriefcaseMedical, Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/ToastContext";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";

const CATEGORY_OPTIONS = [
  "Consultation",
  "Laboratory",
  "Imaging",
  "Maternity",
  "Emergency",
  "Preventive",
  "Surgery",
  "Pharmacy",
  "Other",
];

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

export default function Services() {
  const { role } = useAuth();
  const { toast } = useToast();

  const { services, createService, updateService, deleteService } = useAppData();
  const isAdmin = role === "ADMIN";

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Consultation");
  const [priceRwf, setPriceRwf] = useState("");

  function resetForm() {
    setName("");
    setCategory("Consultation");
    setPriceRwf("");
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setName(row.name || "");
    setCategory(row.category || "Consultation");
    setPriceRwf(String(row.priceRwf ?? ""));
    setOpen(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    try {
      const price = Number(priceRwf);

      if (editing) {
        updateService(editing.id, { name: name.trim(), category, priceRwf: price });
        toast(`Service ${editing.id} updated.`, { type: "success", title: "Updated" });
      } else {
        const created = createService({ name: name.trim(), category, priceRwf: price });
        toast(`Service ${created.id} created.`, { type: "success", title: "Created" });
      }

      setOpen(false);
      resetForm();
    } catch (err) {
      toast(err?.message || "Failed to save service.", { type: "error", title: "Error" });
    }
  }

  const rows = useMemo(() => {
    return (services || []).map((s) => ({
      ...s,
      priceRwf: Number.isFinite(Number(s.priceRwf)) ? Number(s.priceRwf) : 0,
    }));
  }, [services]);

  const columns = useMemo(() => {
    const cols = [
      { key: "id", label: "Service ID" },
      { key: "name", label: "Service" },
      { key: "category", label: "Category" },
      { key: "priceRwf", label: "Price (RWF)" },
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
                if (!window.confirm(`Delete service ${row.id}?`)) return;
                deleteService(row.id);
                toast(`Service ${row.id} deleted.`, { type: "info", title: "Deleted" });
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
  }, [isAdmin, deleteService, toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={BriefcaseMedical}
        title="Services"
        subtitle={
          isAdmin
            ? "Define and manage healthcare services offered across facilities."
            : "View available services. Only Admin can manage them."
        }
        right={
          isAdmin ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} />
              Add Service
            </button>
          ) : null
        }
      />

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Service Catalogue</h3>
          <p className="text-sm text-slate-600 mt-1">Search and paginate through services.</p>
        </div>
        <div className="p-2">
          <DataTable title="Healthcare Services" columns={columns} rows={rows} initialPageSize={10} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? `Edit Service (${editing.id})` : "Add Service"}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editing ? "Update service details." : "Create a new service entry."}
          </div>

          <Input
            label="Service Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., General Consultation"
            required
          />

          <div>
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Price (RWF)"
            type="number"
            min="0"
            value={priceRwf}
            onChange={(e) => setPriceRwf(e.target.value)}
            placeholder="e.g., 5000"
            required
          />

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
            <Button type="submit">{editing ? "Save Changes" : "Create Service"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
