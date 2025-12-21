import React, { useMemo, useState } from "react";
import { Users, Plus, ShieldCheck } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { useAppData } from "../../data/AppDataContext";
import RwandaLocationPicker from "../../components/forms/RwandaLocationPicker";

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

export default function Patients() {
  const auth = useAuth();
  const { role, user } = auth;

  const { patients, createPatient } = useAppData();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [insurance, setInsurance] = useState("Mutuelle de Santé (CBHI)");
  const [tempPassword, setTempPassword] = useState("Temp123!");
  const [location, setLocation] = useState({
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  });

  const [error, setError] = useState("");
  const [createdMsg, setCreatedMsg] = useState("");

  const rows = useMemo(() => {
    if (role === "ADMIN") return patients;
    if (role === "DOCTOR") return patients.filter((p) => p.doctorEmail === user?.email);
    return [];
  }, [role, user?.email, patients]);

  const columns = useMemo(() => {
    const viewCol = {
      key: "view",
      label: "View",
      render: (row) => (
        <Link to={`/app/patients/${row.id}`} className="text-blue-700 hover:underline font-semibold">
          View
        </Link>
      ),
    };

    return [
      { key: "id", label: "Patient ID" },
      { key: "name", label: "Name" },
      { key: "age", label: "Age" },
      { key: "insurance", label: "Insurance" },
      { key: "district", label: "District" },
      { key: "phone", label: "Phone" },
      viewCol,
    ];
  }, []);

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setAge("");
    setInsurance("Mutuelle de Santé (CBHI)");
    setTempPassword("Temp123!");
    setLocation({ province: "", district: "", sector: "", cell: "", village: "" });
  }

  function submit(e) {
    e.preventDefault();
    setError("");
    setCreatedMsg("");

    try {
      if (typeof auth.createUserByStaff !== "function") {
        throw new Error(
          "AuthContext is outdated. Please replace src/auth/AuthContext.jsx and restart the dev server."
        );
      }

      const createdUser = auth.createUserByStaff({
        name,
        email,
        tempPassword,
        role: "PATIENT",
      });

      const createdPatient = createPatient({
        name,
        email: createdUser.email,
        phone,
        age,
        insurance,
        doctorEmail: role === "DOCTOR" ? user?.email : "",
        location,
      });

      setCreatedMsg(
        `Patient created: ${createdPatient.id}. Login: ${createdUser.email} | Temporary Password: ${createdUser.password}`
      );

      resetForm();
      setOpen(false);
    } catch (err) {
      setError(err?.message || "Failed to register patient");
    }
  }

  const canRegister = role === "ADMIN" || role === "DOCTOR";

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Users}
        title="Patients"
        subtitle={role === "ADMIN" ? "All registered patients in the system." : "Patients assigned to you."}
        right={
          canRegister ? (
            <button
              onClick={() => {
                setError("");
                setCreatedMsg("");
                setOpen((v) => !v);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold hover:bg-slate-800 transition"
            >
              <Plus size={18} />
              Register Patient
            </button>
          ) : null
        }
      />

      {createdMsg && (
        <div className="rounded-2xl border border-green-200 bg-green-50 text-green-800 p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck size={16} /> Created successfully
          </div>
          <div className="mt-2">{createdMsg}</div>
        </div>
      )}

      {/* Create panel */}
      {open && (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="text-lg font-extrabold text-slate-900">Register New Patient</div>
            <p className="text-sm text-slate-600 mt-1">Create login + patient record (role-based).</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 text-red-800 p-4 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Phone</label>
                  <input
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+2507..."
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Age</label>
                  <input
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Insurance</label>
                <select
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
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
                <div className="text-xs text-slate-500 mt-1">Appears on appointments and patient profile.</div>
              </div>

              <RwandaLocationPicker value={location} onChange={setLocation} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Temporary Password</label>
                  <input
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    required
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    Give this to the patient. They will login and OTP verify.
                  </div>
                </div>

                <div className="flex items-end gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setError("");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold"
                  >
                    Create Patient
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900">Patients Directory</h3>
          <p className="text-sm text-slate-600 mt-1">Search, filter, and paginate patient records.</p>
        </div>
        <div className="p-2">
          <DataTable title="Patients" columns={columns} rows={rows} initialPageSize={5} />
        </div>
      </div>
    </div>
  );
}
