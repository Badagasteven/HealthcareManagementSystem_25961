import React, { useState } from "react";
import PublicLayout from "../../components/layout/PublicLayout";
import { Card, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
    console.log("📩 Contact message:", form);
  }

  return (
    <PublicLayout title="Contact" subtitle="Send us a message and we’ll respond.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-slate-900">Send a message</h2>
                <p className="text-sm text-slate-600 mt-1">
                  This is a demo contact form for your project submission.
                </p>
              </div>

              {sent ? (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-4 text-sm font-semibold">
                  Message sent (demo). Thank you!
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name" name="name" value={form.name} onChange={onChange} required />
                    <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Message</label>
                    <textarea
                      name="message"
                      className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm min-h-[160px]
                                 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300
                                 placeholder:text-slate-400"
                      value={form.message}
                      onChange={onChange}
                      required
                      placeholder="Write your message..."
                    />
                  </div>

                  <Button className="w-full" type="submit">
                    Send Message
                  </Button>

                  <div className="text-xs text-slate-500 border-t pt-4">
                    Tip: In a real system, messages would be stored in the database or emailed to support.
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Contact info */}
        <Card className="h-fit">
          <CardBody>
            <h3 className="text-lg font-extrabold text-slate-900">Contact Information</h3>
            <p className="text-sm text-slate-600 mt-1">
              Example details for demonstration.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <Mail className="text-sky-700" size={18} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Email</div>
                  <div className="text-sm text-slate-600">support@rhs-demo.rw</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <Phone className="text-sky-700" size={18} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Phone</div>
                  <div className="text-sm text-slate-600">+250 7xx xxx xxx</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                  <MapPin className="text-sky-700" size={18} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Location</div>
                  <div className="text-sm text-slate-600">Kigali, Rwanda</div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Emergency: <span className="font-extrabold text-slate-900">114</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </PublicLayout>
  );
}
