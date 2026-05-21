import React from "react";

export default function Topbar() {
  return (
    <div className="bg-white p-4 shadow flex justify-between">
      <input
        className="border p-2 rounded w-1/3"
        placeholder="Search tasks..."
      />
      <div>User Menu</div>
    </div>
  );
}
