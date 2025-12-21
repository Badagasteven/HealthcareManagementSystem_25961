import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Calendar, Users, FileText, ArrowRight, Search } from "lucide-react";
import PublicLayout from "../../components/layout/PublicLayout";
import { Card, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Home() {
  const features = [
    { title: "Secure Access", icon: ShieldCheck, desc: "Two-factor login and role-based access control." },
    { title: "Appointments", icon: Calendar, desc: "Manage and track appointments efficiently." },
    { title: "User Workflows", icon: Users, desc: "Patients, Doctors, and Admin experiences." },
    { title: "Medical Records", icon: FileText, desc: "Record keeping with controlled access." },
  ];

  const stats = [
    { label: "Role-based Users", value: "Admin / Doctor / Patient" },
    { label: "Core Modules", value: "Patients, Appointments, Records" },
    { label: "Security", value: "Email OTP (2FA) + Reset" },
  ];

  return (
    <PublicLayout title="Welcome" subtitle="Secure healthcare portal for Patients, Doctors, and Administrators.">
      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-10">
        {/* Left */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-8 flex-1 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-xs font-extrabold w-fit border border-sky-100">
              <ShieldCheck size={16} />
              Secure, role-based healthcare system
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4 leading-tight">
              Rwanda Healthcare{" "}
              <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h1>

            <p className="text-slate-600 mt-4 text-base leading-relaxed max-w-xl">
              Manage patients, doctors, appointments, services, and medical records with a modern UI,
              global search, pagination, and secure authentication (2FA).
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link to="/login">
                <Button>
                  Login <ArrowRight className="inline ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="text-xs text-slate-500 font-semibold">{s.label}</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Search size={18} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">Fast information access</div>
                <div className="text-sm text-slate-600">
                  Use global search + table search to find patients, records, and appointments instantly.
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="h-px bg-slate-100 mb-6" />
            <p className="text-xs text-slate-500">
              Tip: Use the role selector on login to access the correct dashboard permissions.
            </p>
          </div>
        </div>

        {/* Right image (stronger, visible) */}
        <div className="relative rounded-3xl shadow-sm overflow-hidden border border-slate-200 min-h-[360px] bg-slate-200">
          <img
            src="/hospital2.jpg"
            alt="Modern hospital"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />

          <div className="relative h-full p-8 flex items-end">
            <div className="max-w-sm">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white px-3 py-1 rounded-full text-xs font-extrabold border border-white/20">
                Ministry style • Clean UI
              </div>
              <div className="mt-3 text-white text-2xl font-extrabold leading-snug drop-shadow">
                A modern portal for secure healthcare management.
              </div>
              <div className="mt-2 text-white/85 text-sm">
                Designed for fast workflows, strong security, and clarity.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Key Features</h2>
        <p className="text-slate-600 mt-1">
          Built for clean workflows, fast access to information, and secure medical record handling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <Card key={f.title}>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-50 p-3 border border-sky-100">
                  <f.icon className="text-sky-700" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">{f.title}</h3>
              </div>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{f.desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </PublicLayout>
  );
}
