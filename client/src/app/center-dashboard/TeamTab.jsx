import React from "react";
import { FaShareAlt, FaInfoCircle, FaEye, FaClipboard, FaMinusCircle } from "react-icons/fa";

export default function TeamTab() {
  return (
    <main className="flex-1 px-8 py-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Team{" "}
          <FaShareAlt className="ml-2 text-blue-600 cursor-pointer" />
        </div>
        <span className="font-bold text-blue-700 cursor-pointer">GNAAGBN</span>
      </div>
      {/* Centre Director */}
      <div className="bg-white rounded shadow border p-5 mb-6">
        <div className="text-xl font-bold mb-2">Centre Director</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Phone</th>
                <th className="font-semibold">Email</th>
                <th className="font-semibold">Attendance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Poonam</td>
                <td>8920406657</td>
                <td>guptaabl1356@gmail.com</td>
                <td className="text-center">
                  <FaEye className="text-blue-600" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Faculties */}
      <div className="bg-white rounded shadow border p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold">
            Faculties{" "}
            <FaInfoCircle className="text-blue-600 text-base" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            Add Faculty
          </button>
        </div>
        <div>
          <div className="font-bold mb-1">Active Faculties</div>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Appointment Letter</th>
                <th>Module Access</th>
                <th>Attendance</th>
                <th>Training</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gupta Enterprises</td>
                <td>8920406657</td>
                <td>guptaabl1356@gmail.com</td>
                <td>NA</td>
                <td>NA</td>
                <td className="text-center">
                  <FaEye className="text-green-600" />
                </td>
                <td className="text-center">
                  <FaEye className="text-blue-600" />
                </td>
                <td className="text-center">
                  <FaClipboard className="text-blue-600" />
                </td>
                <td className="text-center">
                  <FaMinusCircle className="text-red-500" />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="font-bold mb-1">Onboarding Faculties</div>
          <table className="w-full text-sm mb-2">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Counsellors */}
      <div className="bg-white rounded shadow border p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold">
            Counsellors{" "}
            <FaInfoCircle className="text-blue-600 text-base" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm">
            Add Counsellor
          </button>
        </div>
        <div>
          <div className="font-bold mb-1">Active Counsellors</div>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Appointment Letter</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
          <div className="font-bold mb-1">Onboarding Counsellors</div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
