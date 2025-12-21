import React from "react";
import { NavLink } from "react-router-dom";

const link = "text-sm font-medium px-3 py-2 rounded-xl transition";
const active = "bg-white/20";
const idle = "hover:bg-white/10";

export default function PublicLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900">
      <header className="bg-gradient-to-r from-blue-600 via-yellow-400 to-emerald-500 text-white shadow">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="text-xl font-extrabold tracking-tight truncate">
                Rwanda Healthcare Management System
              </div>
              <div className="text-xs opacity-90">Ministry of Health • Secure Portal</div>
            </div>

            <nav className="flex items-center gap-2">
              <NavLink to="/" className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
                About
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `${link} ${isActive ? active : idle}`}>
                Contact
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${link} ${isActive ? "bg-white text-slate-900" : "bg-white text-slate-900 hover:bg-white/90"}`
                }
              >
                Login
              </NavLink>
            </nav>
          </div>

          {(title || subtitle) && (
            <div className="mt-6">
              {title && <h1 className="text-3xl font-extrabold">{title}</h1>}
              {subtitle && <p className="text-white/90 mt-2 max-w-3xl">{subtitle}</p>}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between text-sm text-slate-600">
          <span>© 2025 Ministry of Health - Rwanda</span>
          <span className="font-medium text-slate-700">Emergency: 114</span>
        </div>
      </footer>
    </div>
  );
}
