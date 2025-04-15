"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SupportTicketPage = () => {
  const router = useRouter();

  const handleCreateTicket = () => {
    // Navigate to the ticket creation page
    router.push("/create-ticket");
  };

  return (
    <div className="bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900">
          Support Ticket
        </h1>

        {/* Table Section */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-2 sm:px-4 py-2">#</th>
                <th className="px-2 sm:px-4 py-2">Subject</th>
                <th className="px-2 sm:px-4 py-2">Status</th>
                <th className="px-2 sm:px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="px-2 sm:px-4 py-2" colSpan={4}>
                  <div className="text-center text-gray-500">
                    No tickets available
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Create Ticket Button */}
        <div className="mt-6 text-right">
          <button
            onClick={handleCreateTicket}
            className="px-4 sm:px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none transition duration-300"
          >
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketPage;
