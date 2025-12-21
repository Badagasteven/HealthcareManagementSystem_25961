import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

import Dashboard from "./pages/app/Dashboard";
import DoctorDashboard from "./pages/app/DoctorDashboard";
import PatientDashboard from "./pages/app/PatientDashboard";

import Profile from "./pages/app/Profile";
import Unauthorized from "./pages/app/Unauthorized";
import NotFoundApp from "./pages/app/NotFoundApp";

import Patients from "./pages/app/Patients";
import Doctors from "./pages/app/Doctors";
import Appointments from "./pages/app/Appointments";
import Hospitals from "./pages/app/Hospitals";
import MedicalRecords from "./pages/app/MedicalRecords";
import Prescriptions from "./pages/app/Prescriptions";
import Services from "./pages/app/Services";
import Locations from "./pages/app/Locations";

import AppointmentDetails from "./pages/app/AppointmentDetails";
import MedicalRecordDetails from "./pages/app/MedicalRecordDetails";
import PrescriptionDetails from "./pages/app/PrescriptionDetails";
import PatientDetails from "./pages/app/PatientDetails";

import GlobalSearch from "./pages/app/GlobalSearch";

function AppIndexRedirect() {
  const { role, getDefaultAppPath } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  return <Navigate to={getDefaultAppPath(role)} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Protected App */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* ✅ Role-aware landing */}
        <Route index element={<AppIndexRedirect />} />

        {/* Always available to logged-in users */}
        <Route path="profile" element={<Profile />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* ✅ Global Search available to all roles */}
        <Route element={<ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]} />}>
          <Route path="search" element={<GlobalSearch />} />
        </Route>

        {/* Dashboards by role */}
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={["DOCTOR"]} />}>
          <Route path="doctor-dashboard" element={<DoctorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={["PATIENT"]} />}>
          <Route path="patient-dashboard" element={<PatientDashboard />} />
        </Route>

        {/* Patient file detail page */}
        <Route element={<ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]} />}>
          <Route path="patients/:id" element={<PatientDetails />} />
        </Route>

        {/* ✅ Shared clinical pages (lists filter internally by role/email) */}
        <Route element={<ProtectedRoute roles={["ADMIN", "DOCTOR", "PATIENT"]} />}>
          <Route path="appointments" element={<Appointments />} />
          <Route path="appointments/:id" element={<AppointmentDetails />} />

          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="medical-records/:id" element={<MedicalRecordDetails />} />

          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="prescriptions/:id" element={<PrescriptionDetails />} />

          <Route path="services" element={<Services />} />
        </Route>

        {/* Admin + Doctor only */}
        <Route element={<ProtectedRoute roles={["ADMIN", "DOCTOR"]} />}>
          <Route path="patients" element={<Patients />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="doctors" element={<Doctors />} />
          <Route path="hospitals" element={<Hospitals />} />
          <Route path="locations" element={<Locations />} />
        </Route>

        <Route path="*" element={<NotFoundApp />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
