import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  appointments as seedAppointments,
  patients as seedPatients,
  medicalRecords as seedMedicalRecords,
  prescriptions as seedPrescriptions,
} from "./mockData";
import {
  doctors as seedDoctors,
  hospitals as seedHospitals,
  locations as seedLocations,
  services as seedServices,
} from "./appEntities";

const AppDataContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function nextId(prefix, list) {
  const max = list.reduce((acc, x) => {
    const n = parseInt(String(x.id || "").replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function nextPatientId(existing) {
  const nums = existing
    .map((p) => String(p.id || ""))
    .filter((id) => /^P\d{3,}$/.test(id))
    .map((id) => parseInt(id.replace("P", ""), 10))
    .filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `P${String(max + 1).padStart(3, "0")}`;
}

function buildAutoDoctors(hospitals) {
  const specialties = ["General Medicine", "Pediatrics", "Internal Medicine", "OB/GYN", "Surgery", "Psychiatry"];
  const out = [];
  let i = 1;

  hospitals.forEach((h, idx) => {
    const s1 = specialties[(idx * 2) % specialties.length];
    const s2 = specialties[(idx * 2 + 1) % specialties.length];

    out.push({
      id: `D${String(i++).padStart(3, "0")}`,
      name: `Dr. ${h.district} A (${String(h.name).split(" ")[0]})`,
      email: normalizeEmail(`doc.${String(h.id).toLowerCase()}.a@health.rw`),
      specialty: s1,
      hospitalId: h.id,
    });

    out.push({
      id: `D${String(i++).padStart(3, "0")}`,
      name: `Dr. ${h.district} B (${String(h.name).split(" ")[0]})`,
      email: normalizeEmail(`doc.${String(h.id).toLowerCase()}.b@health.rw`),
      specialty: s2,
      hospitalId: h.id,
    });
  });

  return out;
}

export function AppDataProvider({ children }) {
  // ------------------ Hospitals ------------------
  const [hospitals, setHospitals] = useState(() => loadFromStorage("app_hospitals_v1", [...seedHospitals]));
  useEffect(() => saveToStorage("app_hospitals_v1", hospitals), [hospitals]);

  function getHospitalById(id) {
    return hospitals.find((h) => String(h.id) === String(id)) || null;
  }

  function createHospital(payload) {
    const name = String(payload?.name || "").trim();
    const province = String(payload?.province || "").trim();
    const district = String(payload?.district || "").trim();
    const category = String(payload?.category || "").trim();

    if (!name) throw new Error("Hospital name is required.");
    if (!province) throw new Error("Province is required.");
    if (!district) throw new Error("District is required.");
    if (!category) throw new Error("Category is required.");

    const exists = hospitals.some((h) => String(h.name).toLowerCase() === name.toLowerCase());
    if (exists) throw new Error("This hospital already exists.");

    const id = nextId("H", hospitals);
    const newItem = { id, name, province, district, category };
    setHospitals((prev) => [newItem, ...prev]);
    return newItem;
  }

  function updateHospital(id, patch) {
    setHospitals((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }

  function deleteHospital(id) {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
    setDoctors((prev) => prev.map((d) => (String(d.hospitalId) === String(id) ? { ...d, hospitalId: "" } : d)));
  }

  // ------------------ Doctors ------------------
  const [doctors, setDoctors] = useState(() => {
    const loaded = loadFromStorage("app_doctors_v1", seedDoctors || []);
    if (loaded && loaded.length) return loaded;
    return buildAutoDoctors(seedHospitals.length ? seedHospitals : hospitals);
  });
  useEffect(() => saveToStorage("app_doctors_v1", doctors), [doctors]);

  function getDoctorByEmail(email) {
    const e = normalizeEmail(email);
    return doctors.find((d) => normalizeEmail(d.email) === e) || null;
  }

  function getDoctorsByHospitalId(hospitalId) {
    const hid = String(hospitalId || "");
    return doctors.filter((d) => String(d.hospitalId) === hid);
  }

  function createDoctor(payload) {
    const name = String(payload?.name || "").trim();
    const email = normalizeEmail(payload?.email);
    const specialty = String(payload?.specialty || "").trim();
    const hospitalId = String(payload?.hospitalId || "").trim();

    if (!name) throw new Error("Doctor name is required.");
    if (!email) throw new Error("Doctor email is required.");
    if (!specialty) throw new Error("Specialty is required.");
    if (!hospitalId) throw new Error("Hospital assignment is required.");

    const emailExists = doctors.some((d) => normalizeEmail(d.email) === email);
    if (emailExists) throw new Error("A doctor with this email already exists.");

    const id = nextId("D", doctors);
    const newItem = { id, name, email, specialty, hospitalId };
    setDoctors((prev) => [newItem, ...prev]);
    return newItem;
  }

  function updateDoctor(id, patch) {
    setDoctors((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...patch } : d));
      const edited = next.find((d) => d.id === id);
      if (edited) {
        const email = normalizeEmail(edited.email);
        const dup = next.some((d) => d.id !== id && normalizeEmail(d.email) === email);
        if (dup) throw new Error("Another doctor already uses this email.");
      }
      return next;
    });
  }

  function deleteDoctor(id) {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  }

  // ------------------ Services ------------------
  const [services, setServices] = useState(() =>
    loadFromStorage("app_services_v1", (seedServices || []).map((s) => ({ ...s })))
  );
  useEffect(() => saveToStorage("app_services_v1", services), [services]);

  function createService(payload) {
    const name = String(payload?.name || "").trim();
    const category = String(payload?.category || "").trim();
    const priceRwf = Number(payload?.priceRwf);

    if (!name) throw new Error("Service name is required.");
    if (!category) throw new Error("Category is required.");
    if (!Number.isFinite(priceRwf) || priceRwf < 0) throw new Error("Price must be a valid number (>= 0).");

    const exists = services.some((s) => String(s.name).toLowerCase() === name.toLowerCase());
    if (exists) throw new Error("This service already exists.");

    const id = nextId("S", services);
    const newItem = { id, name, category, priceRwf };
    setServices((prev) => [newItem, ...prev]);
    return newItem;
  }

  function updateService(id, patch) {
    setServices((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      const edited = next.find((s) => s.id === id);
      if (edited) {
        const name = String(edited.name || "").trim();
        const dup = next.some((s) => s.id !== id && String(s.name || "").toLowerCase() === name.toLowerCase());
        if (dup) throw new Error("Another service already uses this name.");
      }
      return next;
    });
  }

  function deleteService(id) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function getServiceById(id) {
    return services.find((s) => String(s.id) === String(id)) || null;
  }

  // ------------------ Appointments (✅ now includes serviceId/serviceName) ------------------
  const [appointments, setAppointments] = useState(() =>
    loadFromStorage(
      "app_appointments_v1",
      (seedAppointments || []).map((a) => ({
        ...a,
        hospitalId: a.hospitalId || "",
        hospitalName: a.hospitalName || a.hospital || "",
        insurance: a.insurance || "",
        serviceId: a.serviceId || "",
        serviceName: a.serviceName || a.service || "",
      }))
    )
  );
  useEffect(() => saveToStorage("app_appointments_v1", appointments), [appointments]);

  function updateAppointment(id, patch) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function confirmAppointment(id) {
    updateAppointment(id, { status: "confirmed" });
  }
  function cancelAppointment(id) {
    updateAppointment(id, { status: "cancelled" });
  }
  function rescheduleAppointment(id, { date, time }) {
    updateAppointment(id, { date, time, status: "pending" });
  }

  function createAppointment({
    patientEmail,
    patientName,
    doctorEmail,
    doctorName,
    date,
    time,
    hospitalId,
    hospitalName,
    insurance,
    serviceId,
    serviceName,
  }) {
    const id = nextId("A", appointments);

    const svc = serviceId ? getServiceById(serviceId) : null;

    const newItem = {
      id,
      patientEmail: normalizeEmail(patientEmail),
      patient: patientName,
      doctorEmail: normalizeEmail(doctorEmail),
      doctor: doctorName,
      date,
      time,
      status: "pending",
      hospitalId: hospitalId || "",
      hospitalName: hospitalName || "",
      insurance: insurance || "",
      serviceId: serviceId || "",
      serviceName: serviceName || svc?.name || "",
    };

    setAppointments((prev) => [newItem, ...prev]);
    return newItem;
  }

  // ------------------ Medical Records ------------------
  const [medicalRecords, setMedicalRecords] = useState(() =>
    loadFromStorage("app_medicalRecords_v1", (seedMedicalRecords || []).map((r) => ({ reviewed: false, ...r })))
  );
  useEffect(() => saveToStorage("app_medicalRecords_v1", medicalRecords), [medicalRecords]);

  function updateMedicalRecord(id, patch) {
    setMedicalRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function markRecordReviewed(id) {
    updateMedicalRecord(id, { reviewed: true });
  }
  function deleteMedicalRecord(id) {
    setMedicalRecords((prev) => prev.filter((r) => r.id !== id));
  }
  function createMedicalRecord(payload) {
    const { patientEmail, patientName, doctorEmail, doctorName, diagnosis, notes, date } = payload || {};
    const pEmail = normalizeEmail(patientEmail);
    const dEmail = normalizeEmail(doctorEmail);
    const diag = String(diagnosis || "").trim();
    const nts = String(notes || "").trim();
    const dt = String(date || "").trim();

    if (!pEmail) throw new Error("Patient is required.");
    if (!dEmail) throw new Error("Doctor is required.");
    if (!diag) throw new Error("Diagnosis is required.");
    if (!dt) throw new Error("Date is required.");

    const id = nextId("MR", medicalRecords);
    const newItem = {
      id,
      patientEmail: pEmail,
      patient: String(patientName || pEmail),
      doctorEmail: dEmail,
      doctor: String(doctorName || dEmail),
      diagnosis: diag,
      notes: nts,
      date: dt,
      reviewed: false,
    };
    setMedicalRecords((prev) => [newItem, ...prev]);
    return newItem;
  }

  // ------------------ Prescriptions ------------------
  const [prescriptions, setPrescriptions] = useState(() =>
    loadFromStorage("app_prescriptions_v1", (seedPrescriptions || []).map((p) => ({ status: "active", ...p })))
  );
  useEffect(() => saveToStorage("app_prescriptions_v1", prescriptions), [prescriptions]);

  function updatePrescription(id, patch) {
    setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function markPrescriptionDispensed(id) {
    updatePrescription(id, { status: "dispensed" });
  }
  function cancelPrescription(id) {
    updatePrescription(id, { status: "cancelled" });
  }
  function deletePrescription(id) {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  }
  function createPrescription(payload) {
    const { patientEmail, patientName, doctorEmail, doctorName, medication, dosage, frequency, durationDays, instructions, dateIssued } = payload || {};
    const pEmail = normalizeEmail(patientEmail);
    const dEmail = normalizeEmail(doctorEmail);
    const med = String(medication || "").trim();
    const dos = String(dosage || "").trim();
    const freq = String(frequency || "").trim();
    const instr = String(instructions || "").trim();
    const issued = String(dateIssued || "").trim();
    const dur = durationDays === "" || durationDays == null ? "" : Number(durationDays);

    if (!pEmail) throw new Error("Patient is required.");
    if (!dEmail) throw new Error("Doctor is required.");
    if (!med) throw new Error("Medication is required.");
    if (!dos) throw new Error("Dosage is required.");
    if (!freq) throw new Error("Frequency is required.");
    if (!issued) throw new Error("Date Issued is required.");
    if (dur !== "" && (!Number.isFinite(dur) || dur < 0)) throw new Error("Duration must be a valid number.");

    const id = nextId("RX", prescriptions);
    const newItem = {
      id,
      patientEmail: pEmail,
      patient: String(patientName || pEmail),
      doctorEmail: dEmail,
      doctor: String(doctorName || dEmail),
      medication: med,
      dosage: dos,
      frequency: freq,
      durationDays: dur === "" ? "" : dur,
      instructions: instr,
      dateIssued: issued,
      status: "active",
    };
    setPrescriptions((prev) => [newItem, ...prev]);
    return newItem;
  }

  // ------------------ Patients ------------------
  const [patients, setPatients] = useState(() => loadFromStorage("app_patients_v1", [...seedPatients]));
  useEffect(() => saveToStorage("app_patients_v1", patients), [patients]);

  function createPatient(payload) {
    const { name, email, phone, age, gender, insurance, doctorEmail, location } = payload;
    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);
    if (!cleanName || !cleanEmail) throw new Error("Name and email are required.");

    const exists = patients.some((p) => normalizeEmail(p.email) === cleanEmail);
    if (exists) throw new Error("A patient with this email already exists.");

    const id = nextPatientId(patients);

    const newPatient = {
      id,
      name: cleanName,
      email: cleanEmail,
      phone: phone || "",
      age: age ? Number(age) : null,
      gender: gender || "",
      insurance: insurance || "",
      doctorEmail: normalizeEmail(doctorEmail) || "",
      address: location
        ? [location.village, location.cell, location.sector, location.district, location.province].filter(Boolean).join(", ")
        : "",
      location: location || null,
      district: location?.district || "",
    };

    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }

  function getPatientById(id) {
    return patients.find((p) => String(p.id) === String(id)) || null;
  }

  function getPatientByEmail(email) {
    const clean = normalizeEmail(email);
    return patients.find((p) => normalizeEmail(p.email) === clean) || null;
  }

  // ------------------ Locations ------------------
  const [locations, setLocations] = useState(() => loadFromStorage("app_locations_v1", [...seedLocations]));
  useEffect(() => saveToStorage("app_locations_v1", locations), [locations]);

  function createLocation(locationObj) {
    const loc = locationObj || {};
    if (!loc.province || !loc.district || !loc.sector || !loc.cell || !loc.village) {
      throw new Error("Please select Province, District, Sector, Cell, and Village.");
    }
    const id = nextId("L", locations);
    const newItem = { id, ...loc };
    setLocations((prev) => [newItem, ...prev]);
    return newItem;
  }
  function updateLocation(id, patch) {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function deleteLocation(id) {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  // directories
  const patientDirectory = patients;
  const doctorDirectory = useMemo(() => doctors.map((d) => ({ email: d.email, name: d.name })), [doctors]);

  const value = useMemo(
    () => ({
      // hospitals
      hospitals,
      createHospital,
      updateHospital,
      deleteHospital,
      getHospitalById,

      // doctors
      doctors,
      createDoctor,
      updateDoctor,
      deleteDoctor,
      getDoctorsByHospitalId,
      getDoctorByEmail,

      // services
      services,
      createService,
      updateService,
      deleteService,
      getServiceById,

      // appointments
      appointments,
      updateAppointment,
      confirmAppointment,
      cancelAppointment,
      rescheduleAppointment,
      createAppointment,

      // medical records
      medicalRecords,
      createMedicalRecord,
      updateMedicalRecord,
      deleteMedicalRecord,
      markRecordReviewed,

      // prescriptions
      prescriptions,
      createPrescription,
      updatePrescription,
      deletePrescription,
      markPrescriptionDispensed,
      cancelPrescription,

      // patients
      patients,
      createPatient,
      getPatientById,
      getPatientByEmail,

      // locations
      locations,
      createLocation,
      updateLocation,
      deleteLocation,

      // directories
      patientDirectory,
      doctorDirectory,
    }),
    [hospitals, doctors, services, appointments, medicalRecords, prescriptions, patients, locations, doctorDirectory]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
