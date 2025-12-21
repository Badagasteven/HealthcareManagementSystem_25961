export const patients = [
  { id: "P001", name: "Uwase Marie", age: 34, district: "Kigali", phone: "+250788123456", email: "patient@health.rw", doctorEmail: "doctor@health.rw" },
  { id: "P002", name: "Mugisha Jean", age: 45, district: "Kigali", phone: "+250788234567", email: "otherpatient@health.rw", doctorEmail: "doctor@health.rw" },
  { id: "P003", name: "Ingabire Sarah", age: 28, district: "Kigali", phone: "+250788345678", email: "sarah@health.rw", doctorEmail: "otherdoctor@health.rw" },
  { id: "P004", name: "Nsabimana Paul", age: 52, district: "Huye", phone: "+250788456789", email: "paul@health.rw", doctorEmail: "otherdoctor@health.rw" },
];

export const appointments = [
  { id: "A001", patientEmail: "patient@health.rw", patient: "Uwase Marie", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", date: "2025-12-21", time: "09:00", status: "confirmed" },
  { id: "A002", patientEmail: "patient@health.rw", patient: "Uwase Marie", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", date: "2025-12-23", time: "10:30", status: "pending" },
  { id: "A003", patientEmail: "otherpatient@health.rw", patient: "Mugisha Jean", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", date: "2025-12-22", time: "14:00", status: "confirmed" },
  { id: "A004", patientEmail: "otherpatient@health.rw", patient: "Mugisha Jean", doctorEmail: "otherdoctor@health.rw", doctor: "Dr. Mukamana Alice", date: "2025-12-24", time: "11:15", status: "confirmed" },
];

export const medicalRecords = [
  { id: "MR001", patientEmail: "patient@health.rw", patient: "Uwase Marie", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", diagnosis: "Malaria", notes: "Prescribed antimalarial. Recheck in 7 days.", date: "2025-12-10" },
  { id: "MR002", patientEmail: "patient@health.rw", patient: "Uwase Marie", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", diagnosis: "Follow-up", notes: "Symptoms improved. Continue hydration.", date: "2025-12-14" },
  { id: "MR003", patientEmail: "otherpatient@health.rw", patient: "Mugisha Jean", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", diagnosis: "Hypertension", notes: "Lifestyle advice + medication review.", date: "2025-12-12" },
  { id: "MR004", patientEmail: "otherpatient@health.rw", patient: "Mugisha Jean", doctorEmail: "otherdoctor@health.rw", doctor: "Dr. Mukamana Alice", diagnosis: "Diabetes", notes: "Diet plan + metformin started.", date: "2025-12-13" },
];

export const prescriptions = [
  { id: "RX001", patientEmail: "patient@health.rw", patient: "Uwase Marie", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", medication: "Artemether-Lumefantrine", dosage: "1 tab twice daily", instructions: "Take after meals.", date: "2025-12-10" },
  { id: "RX002", patientEmail: "patient@health.rw", patient: "Uwase Marie", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", medication: "Paracetamol", dosage: "500mg 3x daily", instructions: "If fever/pain.", date: "2025-12-14" },
  { id: "RX003", patientEmail: "otherpatient@health.rw", patient: "Mugisha Jean", doctorEmail: "doctor@health.rw", doctor: "Dr. Uwimana Grace", medication: "Amlodipine", dosage: "5mg once daily", instructions: "Same time daily.", date: "2025-12-12" },
  { id: "RX004", patientEmail: "otherpatient@health.rw", patient: "Mugisha Jean", doctorEmail: "otherdoctor@health.rw", doctor: "Dr. Mukamana Alice", medication: "Metformin", dosage: "500mg twice daily", instructions: "With meals.", date: "2025-12-13" },
];
