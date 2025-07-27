import React from "react";

export default function OrdersInvoicesTab() {
  return (
    <main className="flex-1 px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-bold text-blue-700 flex items-center">
          Purchase Kits{" "}
          <i className="fa fa-share-alt ml-2 text-blue-600 cursor-pointer"></i>
        </div>
        <span className="font-bold text-blue-700 cursor-pointer">GNAAGBN</span>
      </div>
      <div className="bg-white rounded shadow border p-5">
        <div className="mb-4">
          <div className="text-lg font-bold">Live Class/ Recording Orders:</div>
          <div className="text-gray-500 text-sm mb-2">
            Click on each to view its details.
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Quantity</th>
                <th>Amount</th>
                <th>Payment Type</th>
                <th>Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4">
          <div className="text-lg font-bold">Classroom Orders:</div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Quantity</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4">
          <div className="text-lg font-bold">Wallet Balance:</div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="text-lg font-bold">Renewal Payments</div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount Paid</th>
                <th>Payment ID</th>
                <th>Download Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
