// src/components/forms/RwandaLocationPicker.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  loadRwandaGeo,
  getProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
} from "../../data/rwandaLocations";

export default function RwandaLocationPicker({ value, onChange }) {
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const province = value?.province || "";
  const district = value?.district || "";
  const sector = value?.sector || "";
  const cell = value?.cell || "";
  const village = value?.village || "";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    loadRwandaGeo()
      .then((data) => {
        if (!mounted) return;
        setGeo(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e?.message || "Failed to load Rwanda locations.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const provinces = useMemo(() => (geo ? getProvinces(geo) : []), [geo]);
  const districts = useMemo(
    () => (geo && province ? getDistrictsByProvince(geo, province) : []),
    [geo, province]
  );
  const sectors = useMemo(
    () => (geo && province && district ? getSectorsByDistrict(geo, province, district) : []),
    [geo, province, district]
  );
  const cells = useMemo(
    () => (geo && province && district && sector ? getCellsBySector(geo, province, district, sector) : []),
    [geo, province, district, sector]
  );
  const villages = useMemo(
    () => (geo && province && district && sector && cell ? getVillagesByCell(geo, province, district, sector, cell) : []),
    [geo, province, district, sector, cell]
  );

  function setField(field, val) {
    const next = { ...(value || {}) };

    // Reset lower levels when changing a higher level
    if (field === "province") {
      next.province = val;
      next.district = "";
      next.sector = "";
      next.cell = "";
      next.village = "";
    } else if (field === "district") {
      next.district = val;
      next.sector = "";
      next.cell = "";
      next.village = "";
    } else if (field === "sector") {
      next.sector = val;
      next.cell = "";
      next.village = "";
    } else if (field === "cell") {
      next.cell = val;
      next.village = "";
    } else {
      next[field] = val;
    }

    onChange?.(next);
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Location (Rwanda)</div>

      {loading && (
        <div className="text-sm text-gray-600 border rounded-lg p-3 bg-gray-50">
          Loading Rwanda locations...
        </div>
      )}

      {err && (
        <div className="text-sm text-red-700 border rounded-lg p-3 bg-red-50">
          {err}
        </div>
      )}

      {!loading && !err && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Province</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white"
              value={province}
              onChange={(e) => setField("province", e.target.value)}
              required
            >
              <option value="">Select Province</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">District</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white"
              value={district}
              onChange={(e) => setField("district", e.target.value)}
              disabled={!province}
              required
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Sector</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white"
              value={sector}
              onChange={(e) => setField("sector", e.target.value)}
              disabled={!district}
              required
            >
              <option value="">Select Sector</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Cell</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white"
              value={cell}
              onChange={(e) => setField("cell", e.target.value)}
              disabled={!sector}
              required
            >
              <option value="">Select Cell</option>
              {cells.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Village</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white"
              value={village}
              onChange={(e) => setField("village", e.target.value)}
              disabled={!cell}
              required
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
