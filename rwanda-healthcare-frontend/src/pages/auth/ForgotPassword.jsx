import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.message || "Reset request failed");
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
              <h1 className="text-3xl font-extrabold">Forgot Password</h1>
              <p className="text-white/90 text-sm mt-1">
                A reset code will be sent to your email.
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-8 space-y-5">
              {error && (
                <div className="bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl p-4 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700">Email</label>
                <input
                  className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="name@example.com"
                />
              </div>

              <button
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 font-extrabold disabled:opacity-60 transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <div className="text-sm text-center pt-1">
                <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                  Back to Login
                </Link>
              </div>

              <div className="text-xs text-slate-500 border-t pt-4">
                Tip: Check Spam folder if you don’t receive the reset code.
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden md:block min-h-screen w-full relative">
        <img src="/hospital2.jpg" alt="Hospital" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/10 to-transparent" />
      </div>
    </div>
  );
}
