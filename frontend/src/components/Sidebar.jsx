import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-indigo-700 text-white p-5">
      <h2 className="text-xl font-bold mb-8">TaskFlow</h2>
      <ul className="space-y-4">
        <li>Dashboard</li>
        <li>Projects</li>
        <li>Tasks</li>
        <li>Teams</li>
      </ul>
    </div>
  );
}
