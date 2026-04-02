"use client";

import { useState } from "react";

type Role = "admin" | "staff";

interface LoginProps {
  onLogin: (role: Role) => void;
}

const demoAccounts = {
  admin: {
    employeeId: "admin01",
    password: "admin123",
    label: "Admin",
  },
  staff: {
    employeeId: "staff01",
    password: "staff123",
    label: "Staff",
  },
} as const;

export default function Login({ onLogin }: LoginProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const selectedAccount = demoAccounts[role];

    if (
      employeeId.trim() === selectedAccount.employeeId &&
      password === selectedAccount.password
    ) {
      onLogin(role);
    } else {
      setError("Invalid employee ID, password, or role selection.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">QCIMS Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your role and credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Access Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder={demoAccounts[role].employeeId}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={demoAccounts[role].password}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Demo Credentials</p>
            <p className="mt-2">Admin: `admin01` / `admin123`</p>
            <p>Staff: `staff01` / `staff123`</p>
          </div>
        </form>
      </div>
    </div>
  );
}
