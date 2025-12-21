import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { requestOtp } = useAuth();

  const [role, setRole] = useState("ADMIN");
  const [email, setEmail] = useState("badagaclass@gmail.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestOtp({ email, password, role });
      navigate("/verify-otp");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50">
      {/* LEFT */}
      <div className="min-h-screen w-full flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-yellow-400 to-green-600 text-white p-8">
              <h1 className="text-3xl font-extrabold">Login</h1>
              <p className="text-white/90 text-sm mt-1">
                Select role → enter credentials → verify OTP (2FA)
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-8 space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-sm font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select
                  className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white
                             outline-none focus:ring-2 focus:ring-blue-200"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="ADMIN">Admin</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="PATIENT">Patient</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none
                             focus:ring-2 focus:ring-blue-200"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <input
                  className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none
                             focus:ring-2 focus:ring-blue-200"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 font-extrabold disabled:opacity-60 transition"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Continue (OTP)"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-blue-700 font-semibold hover:underline">
                  Forgot password?
                </Link>
                <Link to="/signup" className="text-blue-700 font-semibold hover:underline">
                  Create account
                </Link>
              </div>

              <div className="text-xs text-slate-500 pt-3 border-t border-slate-100">
                OTP will be sent to your email (check Inbox/Spam).
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:block min-h-screen w-full relative">
        <img src="/hospital1.jpg" alt="Hospital" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/10 to-transparent" />
        <div className="relative h-full p-10 flex items-end">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white px-3 py-1 rounded-full text-xs font-extrabold border border-white/20">
              Secure Access • OTP Login
            </div>
            <div className="mt-3 text-white text-3xl font-extrabold drop-shadow">
              Secure portal for better healthcare operations.
            </div>
            <div className="mt-2 text-white/85 text-sm">
              Fast workflows, protected records, and clear role-based access.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
