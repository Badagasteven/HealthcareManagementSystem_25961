// src/data/rwandaLocations.js
// Uses Rwanda geo structure dataset (province → district → sector → cell → village)
// Source: rwanda-geo-structure package (contains Rwanda's administrative hierarchy)

const RWANDA_GEO_URL =
  "https://cdn.jsdelivr.net/npm/rwanda-geo-structure@1.3.11/rwanda.json";

let _cache = null;

export async function loadRwandaGeo() {
  if (_cache) return _cache;

  // Try localStorage cache first (faster after first load)
  try {
    const raw = localStorage.getItem("rwanda_geo_cache_v1");
    if (raw) {
      _cache = JSON.parse(raw);
      return _cache;
    }
  } catch (e) {
    // ignore
  }

  const res = await fetch(RWANDA_GEO_URL);
  if (!res.ok) throw new Error("Failed to load Rwanda locations dataset");

  const data = await res.json();

  // Cache it
  try {
    localStorage.setItem("rwanda_geo_cache_v1", JSON.stringify(data));
  } catch (e) {
    // ignore
  }

  _cache = data;
  return data;
}

export function getProvinces(geo) {
  return Object.keys(geo?.rwanda || {});
}

export function getDistrictsByProvince(geo, province) {
  return Object.keys(geo?.rwanda?.[province] || {});
}

export function getSectorsByDistrict(geo, province, district) {
  return Object.keys(geo?.rwanda?.[province]?.[district] || {});
}

export function getCellsBySector(geo, province, district, sector) {
  return Object.keys(geo?.rwanda?.[province]?.[district]?.[sector] || {});
}

export function getVillagesByCell(geo, province, district, sector, cell) {
  return geo?.rwanda?.[province]?.[district]?.[sector]?.[cell] || [];
}
