import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Seed users (stored in localStorage on first run)
 * Admin email updated as requested.
 */
const SEED_USERS = [
  { email: "badagaclass@gmail.com", password: "Admin123!", role: "ADMIN", name: "Admin User" },
  { email: "doctor@health.rw", password: "Doctor123!", role: "DOCTOR", name: "Dr. Uwimana Grace" },
  { email: "patient@health.rw", password: "Patient123!", role: "PATIENT", name: "Uwase Marie" },
];

const AuthContext = createContext(null);

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function loadUsers() {
  try {
    const raw = localStorage.getItem("auth_users_v1");
    if (!raw) return SEED_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem("auth_users_v1", JSON.stringify(users));
  } catch {
    // ignore
  }
}

// Backend base URL for OTP + password reset
const API_BASE = (import.meta?.env?.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [user, setUser] = useState(null); // {email, role, name}
  const [pendingOtp, setPendingOtp] = useState(null); // { email, role, name, createdAt }

  const isAuthed = !!user;

  function upsertUsers(next) {
    setUsers(next);
    saveUsers(next);
  }

  // Patient self-registration from Signup page
  function signup({ name, email, password, insurance }) {
    const cleanEmail = normalizeEmail(email);
    const cleanName = String(name || "").trim();
    const cleanPassword = String(password || "");

    if (!cleanName || !cleanEmail || !cleanPassword) throw new Error("All fields are required.");

    const exists = users.some((u) => normalizeEmail(u.email) === cleanEmail);
    if (exists) throw new Error("This email is already registered.");

    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: "PATIENT",
      insurance: insurance || "None",
    };

    upsertUsers([newUser, ...users]);
    return newUser;
  }

  // Staff creates a user manually
  function createUserByStaff({ name, email, tempPassword, role = "PATIENT" }) {
    const cleanEmail = normalizeEmail(email);
    const cleanName = String(name || "").trim();
    const cleanPassword = String(tempPassword || "Temp123!");

    if (!cleanName || !cleanEmail) throw new Error("Name and email are required.");

    const exists = users.some((u) => normalizeEmail(u.email) === cleanEmail);
    if (exists) throw new Error("This email is already registered.");

    const newUser = { name: cleanName, email: cleanEmail, password: cleanPassword, role };
    upsertUsers([newUser, ...users]);
    return newUser;
  }

  // ===========================
  // ✅ LOGIN with Email OTP (2FA)
  // ===========================
  async function requestOtp({ email, password, role }) {
    const cleanEmail = normalizeEmail(email);

    // Step 1: validate credentials locally (your system)
    const found = users.find(
      (u) => normalizeEmail(u.email) === cleanEmail && String(u.password) === String(password)
    );
    if (!found) throw new Error("Invalid email or password");

    // Role dropdown validation
    if (role && String(found.role) !== String(role)) {
      throw new Error(`This account is not a ${role}. Please select the correct role.`);
    }

    // Step 2: ask backend to send OTP to email
    const res = await fetch(`${API_BASE}/api/auth/login-otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Failed to send login OTP email.");

    // Store pending info (NO OTP stored on frontend)
    setPendingOtp({
      email: found.email,
      role: found.role,
      name: found.name,
      createdAt: Date.now(),
    });

    return true;
  }

  async function verifyOtp(code) {
    if (!pendingOtp) throw new Error("No OTP pending. Please login again.");

    const otp = String(code || "").trim();
    if (otp.length < 6) throw new Error("Enter the 6-digit OTP code.");

    const res = await fetch(`${API_BASE}/api/auth/login-otp/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingOtp.email, otp }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "OTP verification failed.");

    const authedUser = {
      email: pendingOtp.email,
      role: pendingOtp.role,
      name: pendingOtp.name,
    };

    setUser(authedUser);
    setPendingOtp(null);
    return authedUser;
  }

  function logout() {
    setUser(null);
    setPendingOtp(null);
  }

  function getDefaultAppPath(role) {
    if (role === "ADMIN") return "/app/dashboard";
    if (role === "DOCTOR") return "/app/doctor-dashboard";
    return "/app/patient-dashboard";
  }

  // ===========================
  // ✅ PASSWORD RESET via Email OTP
  // ===========================
  async function requestPasswordReset(email) {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) throw new Error("Email is required.");

    const res = await fetch(`${API_BASE}/api/auth/password-reset/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Failed to send reset OTP.");

    return true;
  }

  async function resetPassword({ email, token, newPassword }) {
    const cleanEmail = normalizeEmail(email);
    const otp = String(token || "").trim();
    const pass = String(newPassword || "");

    if (!cleanEmail) throw new Error("Email is required.");
    if (!otp) throw new Error("Reset code (OTP) is required.");
    if (pass.length < 6) throw new Error("Password must be at least 6 characters.");

    // verify OTP with backend
    const res = await fetch(`${API_BASE}/api/auth/password-reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, otp }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "OTP verification failed.");

    const exists = users.some((u) => normalizeEmail(u.email) === cleanEmail);
    if (!exists) throw new Error("No account found for this email in the system.");

    const next = users.map((u) =>
      normalizeEmail(u.email) === cleanEmail ? { ...u, password: pass } : u
    );
    upsertUsers(next);

    return true;
  }

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthed,
      pendingOtp,

      // auth
      requestOtp,
      verifyOtp,
      logout,
      getDefaultAppPath,

      // registration
      signup,
      createUserByStaff,

      // password reset
      requestPasswordReset,
      resetPassword,
    }),
    [user, isAuthed, pendingOtp, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
