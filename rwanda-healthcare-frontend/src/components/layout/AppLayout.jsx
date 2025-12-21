import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Toasts from "../ui/Toasts";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar />

        {/* Content */}
        <main className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white text-sm text-slate-600 px-6 py-4 flex justify-between">
          <span>© 2025 Ministry of Health - Rwanda</span>
          <span className="font-semibold">Emergency: 114</span>
        </footer>
      </div>

      {/* Toasts */}
      <Toasts />
    </div>
  );
}
