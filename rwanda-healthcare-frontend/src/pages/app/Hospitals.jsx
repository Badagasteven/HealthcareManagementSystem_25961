import React, { useMemo, useState } from "react";
import { Building2, Plus, Pencil, Trash2, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/ToastContext";
import { useAuth } from "../../auth/AuthContext";
import { useAppData } from "../../data/AppDataContext";

const PROVINCES = ["Kigali City", "Eastern", "Northern", "Southern", "Western"];
const CATEGORIES = [
  "National Referral",
  "Referral",
  "Level 2 Teaching",
  "Provincial",
  "District",
  "District (Maternity focus)",
  "Specialized",
  "Specialized Referral",
  "Specialized (Orthopedic)",
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

export default function Hospitals() {
  const { role } = useAuth();
  const { toast } = useToast();
  const { hospitals, createHospital, updateHospital, deleteHospital } = useAppData();

  const isAdmin = role === "ADMIN";

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [province, setProvince] = useState("Kigali City");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("District");

  const [provinceFilter, setProvinceFilter] = useState("all");

  function resetForm() {
    setName("");
    setProvince("Kigali City");
    setDistrict("");
    setCategory("District");
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setName(row.name || "");
    setProvince(row.province || "Kigali City");
    setDistrict(row.district || "");
    setCategory(row.category || "District");
    setOpen(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        updateHospital(editing.id, { name, province, district, category });
        toast(`Hospital ${editing.id} updated.`, { type: "success", title: "Updated" });
      } else {
        const created = createHospital({ name, province, district, category });
        toast(`Hospital ${created.id} created.`, { type: "success", title: "Created" });
      }
      setOpen(false);
      resetForm();
    } catch (err) {
      toast(err?.message || "Failed to save hospital.", { type: "error", title: "Error" });
    }
  }

  const rows = useMemo(() => {
    const list = [...hospitals];
    if (provinceFilter === "all") return list;
    return list.filter((h) => h.province === provinceFilter);
  }, [hospitals, provinceFilter]);

  const columns = useMemo(() => {
    const cols = [
      { key: "id", label: "Hospital ID" },
      { key: "name", label: "Hospital Name" },
      { key: "category", label: "Category" },
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
                if (!window.confirm(`Delete hospital ${row.id}? Doctors assigned to it will be detached.`)) return;
                deleteHospital(row.id);
                toast(`Hospital ${row.id} deleted.`, { type: "info", title: "Deleted" });
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
  }, [isAdmin, deleteHospital, toast]);

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Building2}
        title="Hospitals"
        subtitle={isAdmin ? "Register and manage hospitals in Rwanda." : "View hospitals directory."}
        right={
          isAdmin ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} />
              Add Hospital
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
              <div className="text-sm text-slate-600">Refine hospitals by province.</div>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Showing <span className="font-extrabold text-slate-900">{rows.length}</span> hospital(s)
          </div>
        </div>

        <div className="p-6 flex items-center gap-3 flex-wrap">
          <label className="text-sm font-semibold text-slate-700">Province</label>
          <select
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
          >
            <option value="all">All provinces</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Hospitals Directory</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter by columns, and paginate.</p>
        </div>
        <div className="p-2">
          <DataTable title="Hospitals Directory" columns={columns} rows={rows} initialPageSize={10} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? `Edit Hospital (${editing.id})` : "Add Hospital"}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editing ? "Update hospital details." : "Create a new hospital entry."}
          </div>

          <Input
            label="Hospital Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., King Faisal Hospital"
            required
          />

          <div>
            <label className="text-sm font-semibold text-slate-700">Province</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 mt-1 bg-white outline-none focus:ring-2 focus:ring-blue-200"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="e.g., Gasabo"
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
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
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
            <Button type="submit">{editing ? "Save Changes" : "Create Hospital"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
