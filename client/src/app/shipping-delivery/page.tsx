"use client";

import Link from "next/link";
import Header from "../components/Header";

export default function ShippingDelivery() {
  return (
    <>
      <Header />
      <div className="mt-20 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Shipping & Delivery Policy
            </h1>
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Overview
                </h2>
                <p>
                  IICPA Institute provides both digital and physical delivery of
                  educational materials, certificates, and course content. This
                  policy outlines our shipping and delivery procedures for all
                  our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Digital Delivery
                </h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Course Access
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Online course access is granted immediately upon
                      successful payment
                    </li>
                    <li>
                      Login credentials are sent via email within 2 hours of
                      enrollment
                    </li>
                    <li>
                      Course materials are available for download from your
                      dashboard
                    </li>
                    <li>
                      Live session links are provided 24 hours before scheduled
                      sessions
                    </li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-800">
                    Digital Certificates
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Digital certificates are issued within 5-7 business days
                      of course completion
                    </li>
                    <li>Certificates are sent via email in PDF format</li>
                    <li>
                      Verification links are provided for certificate
                      authenticity
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Physical Delivery
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Study Materials
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Processing Time:</strong> 2-3 business days
                      </li>
                      <li>
                        <strong>Delivery Time:</strong> 5-7 business days
                        (domestic)
                      </li>
                      <li>
                        <strong>International:</strong> 10-15 business days
                      </li>
                      <li>Tracking information provided via email</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Physical Certificates
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Processing Time:</strong> 7-10 business days
                        after course completion
                      </li>
                      <li>
                        <strong>Delivery Time:</strong> 3-5 business days
                        (domestic)
                      </li>
                      <li>
                        <strong>International:</strong> 7-12 business days
                      </li>
                      <li>Premium packaging and secure delivery</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Shipping Methods
                </h2>
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Standard Delivery
                      </h3>
                      <p className="text-sm">5-7 business days</p>
                      <p className="text-sm font-medium">
                        Free for orders above ₹1000
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        Express Delivery
                      </h3>
                      <p className="text-sm">2-3 business days</p>
                      <p className="text-sm font-medium">Additional ₹200</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  5. Delivery Areas
                </h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Domestic Delivery
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All major cities and towns in India</li>
                    <li>Remote areas may require additional delivery time</li>
                    <li>Free delivery for orders above ₹1000</li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-800">
                    International Delivery
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Available to select countries</li>
                    <li>Additional shipping charges apply</li>
                    <li>Customs duties may be applicable</li>
                    <li>Delivery time varies by location</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Order Tracking
                </h2>
                <div className="space-y-3">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tracking numbers are sent via email and SMS</li>
                    <li>Real-time tracking available on our website</li>
                    <li>
                      Delivery notifications sent upon successful delivery
                    </li>
                    <li>Customer support available for tracking assistance</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  7. Delivery Issues
                </h2>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Failed Deliveries
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Three delivery attempts will be made</li>
                    <li>
                      If unsuccessful, package will be returned to our facility
                    </li>
                    <li>
                      Customer will be contacted for alternative arrangements
                    </li>
                    <li>
                      Additional shipping charges may apply for re-delivery
                    </li>
                  </ul>

                  <h3 className="text-lg font-medium text-gray-800">
                    Damaged Packages
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Report damage within 24 hours of delivery</li>
                    <li>Photographic evidence may be required</li>
                    <li>Free replacement for damaged items</li>
                    <li>Return shipping costs covered by IICPA</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  8. Delivery Charges
                </h2>
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Order Value
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Standard Delivery
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Express Delivery
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            Below ₹500
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹150
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹350
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹500 - ₹1000
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹100
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹300
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">
                            Above ₹1000
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            Free
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ₹200
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  9. International Shipping
                </h2>
                <div className="space-y-3">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Available to select countries only</li>
                    <li>Shipping charges vary by destination</li>
                    <li>
                      Customs duties and taxes are customer&lsquo;s
                      responsibility
                    </li>
                    <li>Delivery time: 7-15 business days</li>
                    <li>Tracking available for all international shipments</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  10. Contact Information
                </h2>
                <p>
                  For shipping and delivery inquiries, please contact us at:
                </p>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p>
                    <strong>Email:</strong> shipping@iicpa.in
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Support Hours:</strong> Monday - Friday, 9:00 AM -
                    6:00 PM IST
                  </p>
                  <p>
                    <strong>Address:</strong> IICPA Institute, Professional
                    Development Center, New Delhi, India
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  11. Policy Updates
                </h2>
                <p>
                  This shipping and delivery policy may be updated from time to
                  time. Customers will be notified of any changes via email or
                  through our website. Continued use of our services constitutes
                  acceptance of the updated policy.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
