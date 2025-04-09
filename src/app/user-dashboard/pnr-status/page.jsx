"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [pnr, setPnr] = useState("");
  const router = useRouter();

  const handleDownload = () => {
    // You can implement the download or fetch logic here
    console.log("Download requested for PNR:", pnr);
  };

  return (
    <div className="  flex justify-center items-center">
      <div className="shadow-lg rounded-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-semibold text-blue-900">Pnr Status</h1>
        
        <div className="mt-6">
          <p className="text-lg text-blue-900">
            Fill the form below Booking id / PNR / Payment id
          </p>
          
          <div className="mt-4">
            <label htmlFor="pnr" className="block text-blue-900 font-semibold">
              Booking id / PNR / Payment id
            </label>
            <input
              type="text"
              id="pnr"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="PNR No"
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none transition duration-300"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
