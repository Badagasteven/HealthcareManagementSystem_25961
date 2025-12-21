import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { pendingOtp, verifyOtp, getDefaultAppPath } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await verifyOtp(code);
      navigate(getDefaultAppPath(user.role), { replace: true });
    } catch (err) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  const disabled = !pendingOtp || loading;

  return (
    <div className="min-h-screen w-screen grid grid-cols-1 md:grid-cols-2 bg-slate-50">
      {/* LEFT */}
      <div className="min-h-screen w-full flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-yellow-400 to-green-600 text-white p-8">
              <h1 className="text-3xl font-extrabold">Verify OTP</h1>
              <p className="text-white/90 text-sm mt-1">
                {pendingOtp
                  ? `We sent a login code to ${pendingOtp.email}. Check Inbox/Spam.`
                  : "No OTP pending. Please login again."}
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-8 space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-sm font-semibold">
                  {error}
                </div>
              )}

              <Input
                label="Enter 6-digit OTP"
                value={code}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(v);
                }}
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                required
                disabled={!pendingOtp || loading}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                If you don’t see the email, check <b>Spam</b> or search: <b>Login OTP</b>.
              </div>

              <Button type="submit" className="w-full" disabled={disabled}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </Button>

              <div className="text-center pt-1">
                <Link to="/login" className="text-blue-700 font-semibold hover:underline text-sm">
                  Back to Login
                </Link>
              </div>

              <div className="text-xs text-slate-500 border-t pt-4">
                Tip: OTP codes usually expire quickly — request a new one if needed.
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
