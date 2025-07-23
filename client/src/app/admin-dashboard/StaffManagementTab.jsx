import React, { useState } from "react";
import { X } from "lucide-react";

// Mock staff list
const mockStaff = [
  {
    id: 1,
    name: "Samiksha",
    email: "sam@example.com",
    role: "Coordinator",
    status: "Active",
    permissions: {
      Dashboard: ["View"],
      Course: ["Add", "View", "Update"],
    },
  },
  {
    id: 2,
    name: "Saksham",
    email: "sak@example.com",
    role: "Content Writer",
    status: "Active",
    permissions: {
      Blogs: ["Add", "Update"],
      Course: ["View"],
    },
  },
];

// Modules and permissions as constants
const MODULES = [
  "Dashboard",
  "Course Category",
  "Course",
  "Live Session",
  "Center",
  "Teachers",
  "Students",
  "Manage Roles",
  "Staff Management",
  "Orders",
  "Enquiries",
  "Jobs",
  "Calendar",
  "Blogs",
];
const PERMISSIONS = ["Add", "View", "Update", "Delete", "Active/Inactive"];

export default function StaffManagement() {
  const [staff, setStaff] = useState(mockStaff);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Open permissions modal for a staff
  const handleOpenModal = (s) => {
    setSelectedStaff(s);
    setModalOpen(true);
  };

  // Save permissions from modal
  const handleSavePermissions = (newPermissions) => {
    setStaff(
      staff.map((s) =>
        s.id === selectedStaff.id ? { ...s, permissions: newPermissions } : s
      )
    );
    setModalOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Staff Management</h2>
      <table className="min-w-full bg-white rounded-lg shadow text-base">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-3">#</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Role</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Authority</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s, i) => (
            <tr key={s.id} className="border-b">
              <td className="py-2 px-3">{i + 1}</td>
              <td className="py-2 px-3">{s.name}</td>
              <td className="py-2 px-3">{s.role}</td>
              <td className="py-2 px-3">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                  {s.status}
                </span>
              </td>
              <td className="py-2 px-3">
                <button
                  className="px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={() => handleOpenModal(s)}
                >
                  Authority
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <RolePermissionModal
          staff={selectedStaff}
          modules={MODULES}
          permissionsList={PERMISSIONS}
          onClose={() => setModalOpen(false)}
          onSave={handleSavePermissions}
        />
      )}
    </div>
  );
}

// Modal component
function RolePermissionModal({
  staff,
  modules,
  permissionsList,
  onClose,
  onSave,
}) {
  // Permissions state
  const [perm, setPerm] = useState(() =>
    modules.reduce(
      (acc, mod) => ({
        ...acc,
        [mod]: staff.permissions[mod] || [],
      }),
      {}
    )
  );

  // Row select all
  const handleModuleSelectAll = (mod, checked) => {
    setPerm((prev) => ({
      ...prev,
      [mod]: checked ? [...permissionsList] : [],
    }));
  };

  // Column select all
  const handlePermissionSelectAll = (permType, checked) => {
    setPerm((prev) => {
      const updated = { ...prev };
      modules.forEach((mod) => {
        if (checked) {
          // Add permission if not present
          if (!updated[mod].includes(permType))
            updated[mod] = [...updated[mod], permType];
        } else {
          // Remove permission
          updated[mod] = updated[mod].filter((p) => p !== permType);
        }
      });
      return updated;
    });
  };

  // Cell checkbox
  const handleCellChange = (mod, permType, checked) => {
    setPerm((prev) => ({
      ...prev,
      [mod]: checked
        ? [...prev[mod], permType]
        : prev[mod].filter((p) => p !== permType),
    }));
  };

  // Helper: is column selected for all?
  const isPermissionAll = (permType) =>
    modules.every((mod) => perm[mod]?.includes(permType));

  // Helper: is row selected for all?
  const isModuleAll = (mod) =>
    permissionsList.every((permType) => perm[mod]?.includes(permType));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">Role Permissions — {staff.name}</h3>
          <button
            className="p-1 text-gray-400 hover:text-black"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-1">Module</th>
                {permissionsList.map((permType) => (
                  <th key={permType} className="border px-2 py-1">
                    <div className="flex items-center gap-2">
                      {permType}
                      <input
                        type="checkbox"
                        checked={isPermissionAll(permType)}
                        onChange={(e) =>
                          handlePermissionSelectAll(permType, e.target.checked)
                        }
                      />
                    </div>
                  </th>
                ))}
                <th className="border px-2 py-1">All</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod}>
                  <td className="border px-2 py-1 font-medium">{mod}</td>
                  {permissionsList.map((permType) => (
                    <td key={permType} className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={perm[mod]?.includes(permType)}
                        onChange={(e) =>
                          handleCellChange(mod, permType, e.target.checked)
                        }
                      />
                    </td>
                  ))}
                  <td className="border px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={isModuleAll(mod)}
                      onChange={(e) =>
                        handleModuleSelectAll(mod, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-indigo-500 text-white"
            onClick={() => onSave(perm)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
