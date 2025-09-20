import React, { useState } from "react";

export default function Departments() {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Sales", status: "active" },
    { id: 2, name: "Engineering", status: "inactive" },
    { id: 3, name: "HR", status: "active" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Departments</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Department
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="p-3 border">{dept.id}</td>
                <td className="p-3 border">{dept.name}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      dept.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dept.status}
                  </span>
                </td>
                <td className="p-3 border space-x-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                    Delete
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}