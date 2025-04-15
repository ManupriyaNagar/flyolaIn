"use client";

import React from "react";

const TravelerInfoStep = ({
  travelerDetails,
  setTravelerDetails,
  handleNextStep,
  handlePreviousStep,
}) => {
  /* ───────────────────────── validation ───────────────────────── */
  const handleSubmit = () => {
    for (const [idx, t] of travelerDetails.entries()) {
      const { title, fullName, dateOfBirth, email, phone } = t;
  
      if (!title || !fullName || !dateOfBirth)
        return alert("Please fill all required fields for every traveller.");
  
      if (idx === 0) {
        if (!/\S+@\S+\.\S+/.test(email))
          return alert("Please enter a valid email address.");
        if (!/^\d{10}$/.test(phone))
          return alert("Please enter a valid 10‑digit phone number.");
      }
    }
    handleNextStep();
  };
  
  /* ───────────────────────── render ───────────────────────── */
  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mt-20">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Traveller Info
      </h2>

      <div className="space-y-4">
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <p>Please fill in the traveller details below.</p>
        </div>

        {travelerDetails.map((traveller, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="font-medium text-gray-800">Traveller {idx + 1}</h3>

            {/* ── core fields ────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Title */}
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <select
                  value={traveller.title}
                  onChange={(e) => {
                    const copy = [...travelerDetails];
                    copy[idx] = { ...copy[idx], title: e.target.value };
                    setTravelerDetails(copy);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                </select>
              </div>

              {/* Full name */}
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={traveller.fullName}
                  onChange={(e) => {
                    const copy = [...travelerDetails];
                    copy[idx] = { ...copy[idx], fullName: e.target.value };
                    setTravelerDetails(copy);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={traveller.dateOfBirth}
                  onChange={(e) => {
                    const copy = [...travelerDetails];
                    copy[idx] = { ...copy[idx], dateOfBirth: e.target.value };
                    setTravelerDetails(copy);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* ── contact fields (only on first traveller) ── */}
            {idx === 0 && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={traveller.email}
                    onChange={(e) => {
                      const copy = [...travelerDetails];
                      copy[idx] = { ...copy[idx], email: e.target.value };
                      setTravelerDetails(copy);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={traveller.phone}
                    onChange={(e) => {
                      const copy = [...travelerDetails];
                      copy[idx] = { ...copy[idx], phone: e.target.value };
                      setTravelerDetails(copy);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* optional address & GST */}
                <div>
                  <label className="block text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={traveller.address}
                    onChange={(e) => {
                      const copy = [...travelerDetails];
                      copy[idx] = { ...copy[idx], address: e.target.value };
                      setTravelerDetails(copy);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    GST Number (optional)
                  </label>
                  <input
                    type="text"
                    value={traveller.gstNumber}
                    onChange={(e) => {
                      const copy = [...travelerDetails];
                      copy[idx] = { ...copy[idx], gstNumber: e.target.value };
                      setTravelerDetails(copy);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ── nav buttons ─────────────────────────────── */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousStep}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next: Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelerInfoStep;
