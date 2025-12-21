import React from "react";
import PublicLayout from "../../components/layout/PublicLayout";
import { Card, CardBody } from "../../components/ui/Card";
import { ShieldCheck, Search, Table, Lock, HeartPulse } from "lucide-react";

export default function About() {
  const bullets = [
    {
      icon: ShieldCheck,
      title: "Role-Based Security",
      desc: "Different dashboards and permissions for Admin, Doctor, and Patient users.",
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      desc: "Email OTP (2FA) for login and email-based password reset for account recovery.",
    },
    {
      icon: Search,
      title: "Powerful Search",
      desc: "Global search plus table-level search across columns for fast information access.",
    },
    {
      icon: Table,
      title: "Clean Data Handling",
      desc: "Pagination and structured lists to keep the system fast and easy to use.",
    },
  ];

  return (
    <PublicLayout
      title="About"
      subtitle="Rwanda Healthcare Management System (RHS) is a secure portal for managing patients, doctors, appointments, services, and medical records."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-10">
        {/* Image (strong visibility) */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-200 min-h-[380px] shadow-sm">
          <img
            src="/hospital3.jpg"
            alt="Nyarugenge District Hospital"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-black/10 to-transparent" />

          <div className="relative p-8 h-full flex items-end">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white px-3 py-1 rounded-full text-xs font-extrabold border border-white/20">
                <HeartPulse size={16} />
                Trusted healthcare workflows
              </div>
              <div className="mt-3 text-white text-2xl font-extrabold drop-shadow">
                Secure access. Clear records. Faster service.
              </div>
              <div className="mt-2 text-white/85 text-sm max-w-md">
                RHS supports healthcare teams and patients with structured management and secure authentication.
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <Card>
          <CardBody>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-extrabold border border-emerald-100">
              Built for modern healthcare workflows
            </div>

            <h2 className="font-extrabold text-2xl md:text-3xl text-slate-900 mt-4">
              Our Mission
            </h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              RHS helps healthcare teams and patients manage appointments and medical information in a
              structured way, while protecting sensitive records through role-based access and secure login.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs text-slate-500 font-semibold">Focus</div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  Accessibility + Security
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs text-slate-500 font-semibold">Designed For</div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  Admins, Doctors, Patients
                </div>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-extrabold text-slate-900">What this system enables</div>
              <ul className="list-disc ml-6 mt-2 text-slate-600 space-y-1 text-sm">
                <li>Improve healthcare data accessibility with role-based security</li>
                <li>Support appointment scheduling and record tracking</li>
                <li>Enable global + table-level search with pagination and sorting</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Core Goals */}
      <Card>
        <CardBody>
          <h2 className="font-extrabold text-xl text-slate-900">Core Goals</h2>
          <p className="text-slate-600 mt-1">
            A clear, secure, and efficient system for managing healthcare operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            {bullets.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-sky-50 p-3 border border-sky-100">
                    <b.icon className="text-sky-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">{b.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </PublicLayout>
  );
}
