import React from "react";

export default function ProfileTab() {
  return (
    <div className="flex-1 p-5">
      {/* License Approved */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">License Approved</div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Download License
          </button>
        </div>
        <div className="mt-2">
          <p>Your ATC has been approved for license from Fincurious.</p>
          <p>
            <b>Date of Agreement: Sep 17 2024</b>
          </p>
        </div>
      </div>

      {/* Owner Info */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold">Owner Information</div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-semibold text-sm mb-1">Name</div>
            <input
              type="text"
              value="Poonam"
              disabled
              className="bg-gray-100 border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">Personal Number</div>
            <input
              type="text"
              value="8920406657"
              disabled
              className="bg-gray-100 border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">Address</div>
            <input
              type="text"
              value="BI-1235,12, PURVANCH ROYAL CITY, greate"
              disabled
              className="bg-gray-100 border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-10 mt-4">
          <div>
            <div className="font-semibold text-xs mb-1">Owner Photo</div>
            <a href="#" className="text-blue-500 text-xl">
              <i className="fa fa-download" />
            </a>
          </div>
          <div>
            <div className="font-semibold text-xs mb-1">Document Proof</div>
            <span className="border bg-gray-50 px-3 py-1 rounded text-xs">
              Not Uploaded
            </span>
          </div>
          <div>
            <div className="font-semibold text-xs mb-1">ID Proof</div>
            <a href="#" className="text-blue-500 text-xl">
              <i className="fa fa-download" />
            </a>
          </div>
        </div>
      </div>

      {/* Centre Info */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="text-xl font-bold mb-3">Centre Information</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <div className="font-semibold text-sm mb-1">Institute Name</div>
            <input
              value="Gupta Enterprises"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">Type of Entity</div>
            <input
              value="Proprietorship"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">
              Primary Number (Fincurious)
            </div>
            <input
              value="8920406657"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <div className="font-semibold text-sm mb-1">Alternate Number</div>
            <input
              value="8920406657"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">Institute Address</div>
            <input
              value="BI-1235,12, PURVANCH ROYAL CITY, greate"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">
              Institute Location Link (Google Maps Link)
            </div>
            <input
              value="https://maps.app.goo.gl/dm"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <div>
            <div className="font-semibold text-sm mb-1">
              Institute Location Link (Iframe)
            </div>
            <input
              value="https://www.google.com/maps/embed"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">State</div>
            <input
              value="Uttar Pradesh"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">District</div>
            <input
              value="Gautam Buddha Nagar"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">Taluk</div>
            <input
              value="Greater Noida"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
        </div>
        <div>
          <div className="font-semibold text-sm mb-1">
            Institute Postal Address (Includes Institute name and phone number).
          </div>
          <input
            value="-"
            className="bg-gray-100 border rounded px-2 py-1 w-full"
            disabled
          />
        </div>
      </div>

      {/* Progress + Parameters */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="font-bold mb-2">Progress:</div>
        <div className="w-full h-5 bg-gray-200 rounded mb-3">
          <div
            className="h-5 bg-yellow-400 rounded"
            style={{ width: "42.86%" }}
          />
        </div>
        <div className="font-bold text-lg mt-2 mb-1">
          License Parameters (Automatic Tracking)
        </div>
        <div className="text-sm mb-2">
          Check them all to complete your checklist and obtain your license!
        </div>
        <div className="bg-gray-100 p-4 rounded mb-3">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" disabled /> Classroom Pic Uploaded
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" disabled /> Marketing Materials Uploaded
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked readOnly /> Center Director
              Onboarded
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked readOnly /> Faculty Onboarded
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" disabled /> Counsellor Onboarded
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked readOnly /> Kit Order
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" disabled /> Signature Uploaded
            </label>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <button className="bg-blue-500 text-white rounded px-4 py-2 w-fit">
              View Faculties
            </button>
            <button className="bg-blue-500 text-white rounded px-4 py-2 w-fit">
              View Counsellors
            </button>
            <button className="bg-blue-500 text-white rounded px-4 py-2 w-fit">
              View Kit Orders
            </button>
          </div>
        </div>
      </div>

      {/* Certificate */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="text-xl font-bold mb-3">Certificate</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="font-semibold text-sm mb-1">
              Full Name of Center Director
            </div>
            <input
              value="ABHAY GUPTA"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">
              Enter Your Designation
            </div>
            <input
              value="Proprietor"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">
              Enter Your Company / Institute Name
            </div>
            <input
              value="Edu nation"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold mb-1">
            Upload your signature for it to appear in the certificate.
          </div>
          <div className="text-red-600 text-xs mb-1">
            *Please upload in png format with transparent background. File size
            should be less than 100KB.
          </div>
          <div className="flex gap-2 mb-2">
            <input type="file" className="border rounded px-2 py-1" />
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Upload Signature
            </button>
          </div>
        </div>
        <div className="mb-3">
          <div className="font-semibold mb-1">Upload your Company Logo.</div>
          <div className="text-red-600 text-xs mb-1">
            *Please upload in png format with transparent background. File size
            should be less than 100KB.
          </div>
          <div className="flex gap-2 mb-2">
            <input type="file" className="border rounded px-2 py-1" />
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Upload Logo
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Pic */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="text-xl font-bold mb-2">Classroom Pic</div>
        <div className="text-sm mb-2">
          Image Should Include:
          <ol className="list-decimal ml-5">
            <li>10 Working Computers</li>
            <li>LED TV</li>
            <li>Faculty Computer</li>
            <li>White Board</li>
            <li>Stickering</li>
          </ol>
        </div>
        <div className="text-red-600 text-xs mb-1">
          *Please upload in png format with transparent background. File size
          should be less than 100KB.
        </div>
        <div className="flex gap-2 mb-2">
          <input type="file" className="border rounded px-2 py-1" />
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Upload
          </button>
        </div>
      </div>
      {/* More Upload sections */}
      {[
        {
          label: "Name Board (Outer Area)",
          desc: "A board with Fincurious Certificate outside your Institute",
        },
        {
          label: "Classroom Stickering",
          desc: "Stickers for Classroom (to be printed in A3 or equivalent size)",
        },
        {
          label: "Entrance / Reception Area",
          desc: "Stickering / Standee should be printed in the Interior of the Institute.",
        },
        {
          label: "Marketing Materials Image",
          desc: "Print the Brochure / Trifold available in 'Design Files' folder with your Logo, address and Phone number edited in it.",
        },
      ].map((s, i) => (
        <div key={s.label} className="bg-white shadow rounded border p-5 mb-5">
          <div className="font-bold mb-2">{s.label}</div>
          <div className="mb-2 text-sm">{s.desc}</div>
          <div className="flex gap-2 mb-2">
            <input type="file" className="border rounded px-2 py-1" />
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Upload
            </button>
          </div>
        </div>
      ))}

      {/* GST & PAN */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xl font-bold">GST&PAN Information</div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">GST Number</div>
            <input
              value="NA"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">PAN Number</div>
            <input
              value="ANVPG7135N"
              className="bg-gray-100 border rounded px-2 py-1 w-full"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <div className="font-semibold text-sm mb-1">GST Doc</div>
            <span className="border bg-gray-50 px-3 py-1 rounded text-xs">
              Not Uploaded
            </span>
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">PAN Number</div>
            <span className="border bg-gray-50 px-3 py-1 rounded text-xs">
              Not Uploaded
            </span>
          </div>
        </div>
      </div>

      {/* Receipt Book & Brochure */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="font-bold mb-2">Receipt Book</div>
        <div className="text-sm mb-2">
          Keep a Receipt book separately for Fincurious. It will be easier to
          track payments from Fincurious students only.
        </div>
        <div className="flex gap-2 mb-2">
          <input type="file" className="border rounded px-2 py-1" />
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Upload
          </button>
        </div>
      </div>
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="font-bold mb-2">Edited Student Brochure</div>
        <div className="text-sm mb-2">
          Please upload the edited version of your student brochure here. Make
          sure that your logo, phone number, address and pricing are clearly
          mentioned in the brochure.
        </div>
        <div className="flex gap-2 mb-2">
          <input type="file" className="border rounded px-2 py-1" />
          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            Upload
          </button>
        </div>
      </div>

      {/* Other Details */}
      <div className="bg-white shadow rounded border p-5 mb-5">
        <div className="font-bold mb-2">Other Details</div>
        <div className="mb-2 text-sm">
          Please check the Following Items when its available in your institute:
        </div>
        <label className="flex items-center gap-2 mb-1">
          <input type="checkbox" className="w-4 h-4" /> Faculty Computer
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input type="checkbox" className="w-4 h-4" /> Counsellor Computer
        </label>
        <label className="flex items-center gap-2 mb-1">
          <input type="checkbox" className="w-4 h-4" /> Internet for all Systems
        </label>
      </div>
    </div>
  );
}
