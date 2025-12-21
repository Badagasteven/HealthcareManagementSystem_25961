import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Calendar,
  FileText,
  Pill,
  Stethoscope,
  Building2,
  MapPinned,
  Sparkles,
} from "lucide-react";

import DataTable from "../../components/ui/DataTable";
import { useAppData } from "../../data/AppDataContext";
import { doctors, services, locations } from "../../data/appEntities";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function includesAny(obj, q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return Object.values(obj).some((v) => String(v ?? "").toLowerCase().includes(needle));
}

function SectionCard({ icon: Icon, title, count, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon className="text-blue-600" size={18} />
          <div className="font-extrabold text-slate-900">{title}</div>
        </div>
        <div className="text-sm text-slate-600">
          Matches: <span className="font-extrabold text-slate-900">{count}</span>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function GlobalSearch() {
  const { patients, appointments, medicalRecords, prescriptions, hospitals } = useAppData();
  const query = useQuery();
  const navigate = useNavigate();

  const initial = query.get("q") || "";
  const [q, setQ] = useState(initial);

  const results = useMemo(() => {
    const keyword = q.trim();
    return {
      patients: (patients || []).filter((p) => includesAny(p, keyword)),
      appointments: (appointments || []).filter((a) => includesAny(a, keyword)),
      medicalRecords: (medicalRecords || []).filter((r) => includesAny(r, keyword)),
      prescriptions: (prescriptions || []).filter((p) => includesAny(p, keyword)),
      doctors: (doctors || []).filter((d) => includesAny(d, keyword)),
      hospitals: (hospitals || []).filter((h) => includesAny(h, keyword)),
      services: (services || []).filter((s) => includesAny(s, keyword)),
      locations: (locations || []).filter((l) => includesAny(l, keyword)),
    };
  }, [q, patients, appointments, medicalRecords, prescriptions, hospitals]);

  function updateUrl(next) {
    const qs = new URLSearchParams();
    if (next.trim()) qs.set("q", next.trim());
    navigate(`/app/search?${qs.toString()}`);
  }

  const total =
    results.patients.length +
    results.appointments.length +
    results.medicalRecords.length +
    results.prescriptions.length +
    results.doctors.length +
    results.hospitals.length +
    results.services.length +
    results.locations.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Search size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                Global Search <Sparkles className="text-blue-600" size={18} />
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Search across Patients, Appointments, Records, Prescriptions, Doctors, Hospitals, Services, and Locations.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
            Total matches: <span className="font-extrabold text-slate-900">{total}</span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="font-extrabold text-slate-900">Search</div>
          <div className="text-sm text-slate-600 mt-1">
            Try: name, email, district, diagnosis, medication, hospital, specialty…
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-2 flex-wrap">
            <input
              className="flex-1 min-w-[240px] border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Search anything…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                updateUrl(e.target.value);
              }}
            />
            <button
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold transition"
              type="button"
              onClick={() => {
                setQ("");
                updateUrl("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Primary entities */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard icon={Users} title="Patients" count={results.patients.length}>
          {results.patients.length === 0 ? (
            <p className="text-sm text-slate-600">No matches.</p>
          ) : (
            <div className="space-y-3">
              {results.patients.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 truncate">{p.email}</div>
                  </div>
                  <Link className="text-blue-700 hover:underline text-sm font-semibold" to={`/app/patients/${p.id}`}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard icon={Calendar} title="Appointments" count={results.appointments.length}>
          {results.appointments.length === 0 ? (
            <p className="text-sm text-slate-600">No matches.</p>
          ) : (
            <div className="space-y-3">
              {results.appointments.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">
                      {a.patient} • {a.doctor}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {a.date} • {a.time} • {a.hospitalName || "—"}
                    </div>
                  </div>
                  <Link className="text-blue-700 hover:underline text-sm font-semibold" to={`/app/appointments/${a.id}`}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard icon={FileText} title="Medical Records" count={results.medicalRecords.length}>
          {results.medicalRecords.length === 0 ? (
            <p className="text-sm text-slate-600">No matches.</p>
          ) : (
            <div className="space-y-3">
              {results.medicalRecords.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">
                      {r.patient} • {r.diagnosis}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {r.date} • {r.doctor}
                    </div>
                  </div>
                  <Link className="text-blue-700 hover:underline text-sm font-semibold" to={`/app/medical-records/${r.id}`}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard icon={Pill} title="Prescriptions" count={results.prescriptions.length}>
          {results.prescriptions.length === 0 ? (
            <p className="text-sm text-slate-600">No matches.</p>
          ) : (
            <div className="space-y-3">
              {results.prescriptions.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">
                      {p.patient} • {p.medication}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {p.date} • {p.doctor}
                    </div>
                  </div>
                  <Link className="text-blue-700 hover:underline text-sm font-semibold" to={`/app/prescriptions/${p.id}`}>
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Secondary entities (tables) */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Stethoscope className="text-blue-600" size={18} /> Doctors
            </div>
            <div className="text-sm text-slate-600">
              Matches: <span className="font-extrabold text-slate-900">{results.doctors.length}</span>
            </div>
          </div>
          <div className="p-2">
            <DataTable
              title="Doctors"
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "specialty", label: "Specialty" },
                { key: "hospital", label: "Hospital" },
              ]}
              rows={results.doctors}
              initialPageSize={5}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Building2 className="text-blue-600" size={18} /> Hospitals
            </div>
            <div className="text-sm text-slate-600">
              Matches: <span className="font-extrabold text-slate-900">{results.hospitals.length}</span>
            </div>
          </div>
          <div className="p-2">
            <DataTable
              title="Hospitals"
              columns={[
                { key: "id", label: "ID" },
                { key: "province", label: "Province" },
                { key: "district", label: "District" },
                { key: "name", label: "Name" },
                { key: "category", label: "Category" },
              ]}
              rows={results.hospitals}
              initialPageSize={5}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <MapPinned className="text-blue-600" size={18} /> Locations
            </div>
            <div className="text-sm text-slate-600">
              Matches: <span className="font-extrabold text-slate-900">{results.locations.length}</span>
            </div>
          </div>
          <div className="p-2">
            <DataTable
              title="Locations"
              columns={[
                { key: "province", label: "Province" },
                { key: "district", label: "District" },
                { key: "sector", label: "Sector" },
                { key: "cell", label: "Cell" },
                { key: "village", label: "Village" },
              ]}
              rows={results.locations}
              initialPageSize={5}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <FileText className="text-blue-600" size={18} /> Services
            </div>
            <div className="text-sm text-slate-600">
              Matches: <span className="font-extrabold text-slate-900">{results.services.length}</span>
            </div>
          </div>
          <div className="p-2">
            <DataTable
              title="Services"
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Service" },
                { key: "category", label: "Category" },
                { key: "priceRwf", label: "Price (RWF)" },
              ]}
              rows={results.services}
              initialPageSize={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
