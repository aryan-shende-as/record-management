import { getUserRole } from "../../auth/authService";
import React, { useState, useEffect } from "react";
import { Edit2, Trash2, MapPin } from "lucide-react";

const DepartmentTable = ({ departments, editClick, deleteClick }) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white border border-gray-200 text-gray-700 text-center">
        <thead className="bg-gray-100 text-sm font-semibold text-gray-700 uppercase font-sans">
          <tr>
            <th className="px-3 py-2 border-b">Department ID</th>
            <th className="px-3 py-2 border-b">Department Name</th>
            <th className="px-3 py-2 border-b">Location</th>
            {role === "Admin" && <th className="px-3 py-2 border-b">Options</th>}
          </tr>
        </thead>
        <tbody className="text-[15px]">
          {departments.map((dep, idx) => (
            <tr
              key={dep.DepartmentId}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
            >
              <td className="px-3 py-2 border-b text-center">{dep.DepartmentId}</td>
              <td className="px-3 py-2 border-b text-center">{dep.DepartmentName}</td>
              <td className="px-3 py-2 border-b text-center">
                <div className="flex items-center justify-center gap-2 relative group">
                  <span>{dep.Location}</span>
                  <MapPin
                    size={16}
                    className="text-blue-600 cursor-pointer"
                    title="Hover to preview on map"
                  />

                  {/* Hover Pop-Up Map */}
                  <div className="absolute left-8 top-6 z-50 hidden group-hover:block w-64 h-40 border rounded shadow-lg">
                    <iframe
                      title="Map Preview"
                      width="100%"
                      height="100%"
                      className="rounded"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(dep.Location)}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </td>
              {role === "Admin" && (
                <td className="px-3 py-2 border-b space-x-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center p-1.5 rounded hover:bg-blue-100 transition"
                      onClick={() => editClick(dep)}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      title="Edit"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center p-1.5 rounded hover:bg-red-100 transition"
                      onClick={() => deleteClick(dep.DepartmentId)}
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;
