import React, { useMemo, useState } from "react";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { Search, ArrowUpDown } from "lucide-react";

export default function DataTable({ title, columns, rows, initialPageSize = 5 }) {
  const [global, setGlobal] = useState("");
  const [filters, setFilters] = useState(() => Object.fromEntries(columns.map((c) => [c.key, ""])));

  const [sort, setSort] = useState({ key: null, dir: "asc" }); // asc | desc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [showFilters, setShowFilters] = useState(true);

  const filteredRows = useMemo(() => {
    const g = global.trim().toLowerCase();

    return rows.filter((row) => {
      const globalOk =
        !g || columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(g));

      const columnOk = columns.every((c) => {
        const f = String(filters[c.key] || "").trim().toLowerCase();
        if (!f) return true;
        return String(row[c.key] ?? "").toLowerCase().includes(f);
      });

      return globalOk && columnOk;
    });
  }, [rows, columns, global, filters]);

  const sortedRows = useMemo(() => {
    if (!sort.key) return filteredRows;

    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filteredRows;

    const dir = sort.dir === "asc" ? 1 : -1;

    return [...filteredRows].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];

      const an = Number(av);
      const bn = Number(bv);
      const bothNum = !Number.isNaN(an) && !Number.isNaN(bn);

      if (bothNum) return (an - bn) * dir;

      return (
        String(av ?? "").localeCompare(String(bv ?? ""), undefined, { sensitivity: "base" }) * dir
      );
    });
  }, [filteredRows, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, safePage, pageSize]);

  function updateGlobal(v) {
    setGlobal(v);
    setPage(1);
  }

  function updateFilter(key, v) {
    setFilters((prev) => ({ ...prev, [key]: v }));
    setPage(1);
  }

  function toggleSort(key) {
    setPage(1);
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* header */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">
              <span className="font-extrabold text-slate-900">{sortedRows.length}</span> result(s)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold transition"
              onClick={() => setShowFilters((v) => !v)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600 font-semibold">Rows:</label>
              <select
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* global search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search size={16} />
          </div>
          <input
            className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Global search..."
            value={global}
            onChange={(e) => updateGlobal(e.target.value)}
          />
        </div>

        {/* column filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {columns.map((c) => (
              <input
                key={c.key}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200"
                placeholder={`Filter by ${c.label}`}
                value={filters[c.key]}
                onChange={(e) => updateFilter(c.key, e.target.value)}
              />
            ))}
          </div>
        )}
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 text-white">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-6 py-3 text-left cursor-pointer select-none whitespace-nowrap"
                  onClick={() => toggleSort(c.key)}
                  title="Click to sort"
                >
                  <span className="inline-flex items-center gap-2 font-extrabold">
                    {c.label}
                    {sort.key === c.key ? (
                      <span className="text-xs opacity-90">{sort.dir === "asc" ? "▲" : "▼"}</span>
                    ) : (
                      <ArrowUpDown size={14} className="opacity-70" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pagedRows.map((row, idx) => (
              <tr
                key={idx}
                className={[
                  "border-b border-slate-100",
                  "hover:bg-slate-50 transition",
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                ].join(" ")}
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-6 py-4 text-sm text-slate-800 align-top">
                    {typeof c.render === "function" ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}

            {pagedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
