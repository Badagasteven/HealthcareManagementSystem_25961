import React from "react";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-yellow-400 to-green-600 text-white shadow">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold">Rwanda Healthcare Management System</h1>
          <p className="text-xs opacity-90">Ministry of Health - Republic of Rwanda</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">Secure Portal</p>
          <p className="text-xs opacity-90">Patients • Doctors • Admin</p>
        </div>
      </div>
    </header>
  );
}
