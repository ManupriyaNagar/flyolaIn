"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();



  return (
    <div className=" bg-gray-50 flex justify-center items-center">
      <div className="bg-white  rounded-lg w-full max-w-7xl">
        <h1 className="text-3xl font-semibold text-blue-900">Booking History</h1>

        {/* Table Section */}
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">BookingId</th>
                <th className="px-4 py-2">PNR</th>
                <th className="px-4 py-2">Fly Date</th>
                <th className="px-4 py-2">Passenger</th>
                <th className="px-4 py-2">Sector</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="px-4 py-2" colSpan={9}>
                  <div className="text-center text-gray-500">Data not found</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Logout Button */}
      
      </div>
    </div>
  );
};

export default Page;
