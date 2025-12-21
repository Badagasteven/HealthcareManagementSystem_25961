import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export default function Topbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function goSearch() {
    const keyword = q.trim();
    const qs = new URLSearchParams();
    if (keyword) qs.set("q", keyword);
    navigate(`/app/search?${qs.toString()}`);
  }

  return (
    <header className="sticky top-0 z-20">
      <div className="bg-gradient-to-r from-blue-600 via-yellow-400 to-emerald-500 text-white shadow">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Title */}
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-extrabold leading-tight truncate">
              Rwanda Healthcare Management System
            </h1>
            <p className="text-xs md:text-sm opacity-90">
              Ministry of Health • Secure Portal
            </p>
          </div>

          {/* Desktop Search + User */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/85" size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
                placeholder="Search pages..."
                className="pl-10 pr-3 py-2 rounded-xl text-sm bg-white/15 border border-white/20
                           placeholder:text-white/75 outline-none focus:bg-white/20 w-64"
              />
            </div>

            <button
              onClick={goSearch}
              className="px-4 py-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/20
                         text-white font-semibold transition"
              type="button"
            >
              Search
            </button>

            <div className="text-right">
              <div className="text-sm font-semibold leading-tight">
                {user?.name || "User"}
              </div>
              <div className="text-xs opacity-90">{role || "-"}</div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden w-full">
            <div className="flex items-center gap-2 mt-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-white/85" size={18} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goSearch()}
                  placeholder="Search pages..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl text-sm bg-white/15 border border-white/20
                             placeholder:text-white/75 outline-none focus:bg-white/20"
                />
              </div>
              <button
                onClick={goSearch}
                className="px-4 py-2 rounded-xl bg-white/15 border border-white/20 hover:bg-white/20
                           text-white font-semibold transition"
                type="button"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
