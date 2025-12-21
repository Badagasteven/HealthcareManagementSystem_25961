import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  Calendar,
  Users,
  FileText,
  Pill,
  Stethoscope,
  Building2,
  MapPin,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function Sidebar() {
  const { user, role, logout, getDefaultAppPath } = useAuth();
  const navigate = useNavigate();

  const links = useMemo(() => {
    const dashboard =
      role === "ADMIN"
        ? { to: "/app/dashboard", label: "Admin Dashboard", icon: Activity, roles: ["ADMIN"] }
        : role === "DOCTOR"
        ? { to: "/app/doctor-dashboard", label: "Doctor Dashboard", icon: Activity, roles: ["DOCTOR"] }
        : { to: "/app/patient-dashboard", label: "Patient Dashboard", icon: Activity, roles: ["PATIENT"] };

    return [
      dashboard,
      { to: "/app/profile", label: "My Profile", icon: User, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
      { to: "/app/appointments", label: "Appointments", icon: Calendar, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
      { to: "/app/patients", label: "Patients", icon: Users, roles: ["ADMIN", "DOCTOR"] },
      { to: "/app/medical-records", label: "Medical Records", icon: FileText, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
      { to: "/app/prescriptions", label: "Prescriptions", icon: Pill, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
      { to: "/app/services", label: "Services", icon: FileText, roles: ["ADMIN", "DOCTOR", "PATIENT"] },
      { to: "/app/doctors", label: "Doctors", icon: Stethoscope, roles: ["ADMIN"] },
      { to: "/app/hospitals", label: "Hospitals", icon: Building2, roles: ["ADMIN"] },
      { to: "/app/locations", label: "Locations", icon: MapPin, roles: ["ADMIN"] },
    ].filter((l) => l.roles.includes(role));
  }, [role]);

  function onLogout() {
    logout();
    navigate("/");
  }

  function goHome() {
    navigate(getDefaultAppPath(role));
  }

  return (
    <aside className="hidden md:flex w-80 min-h-screen flex-col bg-[#070A12] text-white relative">
      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      {/* brand */}
      <button
        onClick={goHome}
        className="relative p-6 border-b border-white/10 hover:bg-white/5 transition text-left"
        type="button"
      >
        <div className="text-xl font-extrabold">RHS Portal</div>
        <div className="text-xs text-white/60 truncate">{user?.email}</div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-extrabold">
            {(user?.name || "U")[0]}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{user?.name || "User"}</div>
            <div className="text-xs text-white/60">{role}</div>
          </div>
        </div>
      </button>

      {/* nav */}
      <nav className="relative p-3 flex-1 space-y-1 overflow-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              cx(
                "group flex items-center justify-between px-3 py-3 rounded-xl text-sm transition",
                isActive
                  ? "bg-gradient-to-r from-blue-600/90 to-emerald-500/70 shadow border border-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )
            }
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center border border-white/10">
                <l.icon size={18} />
              </div>
              <span className="truncate">{l.label}</span>
            </div>

            <ChevronRight size={16} className="opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* logout */}
      <div className="relative p-5 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full rounded-xl py-3 bg-white/5 border border-white/10 hover:bg-red-500/20 transition font-semibold"
          type="button"
        >
          <LogOut size={16} className="inline mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
