import React, { useMemo, useState } from "react";
import { MapPinned, Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import RwandaLocationPicker from "../../components/forms/RwandaLocationPicker";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/ToastContext";
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

export default function Locations() {
  const { toast } = useToast();
  const { locations, createLocation, updateLocation, deleteLocation } = useAppData();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // location row
  const [pickerValue, setPickerValue] = useState({
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  });

  function resetForm() {
    setPickerValue({ province: "", district: "", sector: "", cell: "", village: "" });
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setPickerValue({
      province: row.province || "",
      district: row.district || "",
      sector: row.sector || "",
      cell: row.cell || "",
      village: row.village || "",
    });
    setOpen(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        updateLocation(editing.id, { ...pickerValue });
        toast(`Location ${editing.id} updated.`, { type: "success", title: "Updated" });
      } else {
        const created = createLocation(pickerValue);
        toast(`Location ${created.id} created.`, { type: "success", title: "Created" });
      }
      setOpen(false);
      resetForm();
    } catch (err) {
      toast(err?.message || "Failed to save location.", { type: "error", title: "Error" });
    }
  }

  const rows = useMemo(() => [...locations], [locations]);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "province", label: "Province" },
      { key: "district", label: "District" },
      { key: "sector", label: "Sector" },
      { key: "cell", label: "Cell" },
      { key: "village", label: "Village" },
      {
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
                if (!window.confirm(`Delete location ${row.id}?`)) return;
                deleteLocation(row.id);
                toast(`Location ${row.id} deleted.`, { type: "info", title: "Deleted" });
              }}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        ),
      },
    ],
    [deleteLocation, toast]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        icon={MapPinned}
        title="Locations"
        subtitle="Admin-managed Rwanda location directory (province → district → sector → cell → village)."
        right={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
          >
            <Plus size={18} />
            Add Location
          </button>
        }
      />

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Rwanda Locations</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter by columns, and paginate.</p>
        </div>
        <div className="p-2">
          <DataTable title="Rwanda Locations (Admin Managed)" columns={columns} rows={rows} initialPageSize={10} />
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? `Edit Location (${editing.id})` : "Add Location"}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {editing ? "Update location structure." : "Create a new location."}
          </div>

          <RwandaLocationPicker value={pickerValue} onChange={setPickerValue} />

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
            <Button type="submit">{editing ? "Save Changes" : "Create Location"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
