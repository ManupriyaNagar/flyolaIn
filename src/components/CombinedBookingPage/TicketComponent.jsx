"use client";

import React, { useEffect } from "react";
import {
  FaPlane,
  FaClock,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TicketComponent = ({ bookingData, travelerDetails }) => {
  const totalPassengers = travelerDetails.length;
  const ticketNumber = `TICKET-${Date.now().toString(36).toUpperCase()}`;

  /* ───────────────────────── pdf helper ───────────────────────── */
  const generatePDF = () => {
    const input = document.getElementById("ticket-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`flight_ticket_${ticketNumber}.pdf`);
    });
  };

  /* auto‑download once mounted */
  useEffect(() => generatePDF(), []);

  /* ───────────────────────── render ───────────────────────── */
  return (
    <div className="w-full max-w-3xl mx-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">
        Flight Ticket
      </h2>
      <div className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-lg font-medium text-gray-800">
          Ticket Number:&nbsp;
          <span className="font-bold">{ticketNumber}</span>
        </p>
      </div>
      <div id="ticket-content" className="space-y-4">
        {/* flight info */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-medium text-gray-800">
            Flight Information
          </h3>
          <p className="text-sm text-gray-700 flex flex-wrap items-center gap-2">
            <FaPlane className="text-indigo-500" />
            From:&nbsp;
            <span className="font-semibold">{bookingData.departure}</span>
            &nbsp;To:&nbsp;
            <span className="font-semibold">{bookingData.arrival}</span>
          </p>
          <p className="text-sm text-gray-700 flex flex-wrap items-center gap-2">
            <FaClock className="text-gray-500" />
            Date:&nbsp;
            <span className="font-semibold">{bookingData.selectedDate}</span>
          </p>
          <p className="text-sm text-gray-700 flex flex-wrap items-center gap-2">
            <FaClock className="text-gray-500" />
            Departure:&nbsp;
            <span className="font-semibold">{bookingData.departureTime}</span>
            &nbsp;- Arrival:&nbsp;
            <span className="font-semibold">{bookingData.arrivalTime}</span>
          </p>
          <p className="text-sm text-gray-700 flex flex-wrap items-center gap-2">
            <FaUserFriends className="text-gray-500" />
            Passengers:&nbsp;
            <span className="font-semibold">{totalPassengers}</span>
          </p>
          <p className="text-sm text-gray-700">
            Flight ID:&nbsp;
            <span className="font-semibold">{bookingData.id}</span>
          </p>
        </div>
        {/* traveller(s) */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-medium text-gray-800">Traveller(s)</h3>
          {travelerDetails.map((t, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 pb-3 mb-3 text-sm text-gray-700"
            >
              <p className="font-semibold mb-1">
                #{idx + 1} – {t.title} {t.fullName}
              </p>
              <p>DOB&nbsp;{t.dateOfBirth}</p>
              {/* show e‑mail / phone only for the first traveller */}
              {idx === 0 && (
                <>
                  <p className="flex flex-wrap items-center gap-2">
                    <FaEnvelope /> {t.email}
                  </p>
                  <p className="flex flex-wrap items-center gap-2">
                    <FaPhone /> {t.phone}
                  </p>
                  {t.address && (
                    <p className="flex flex-wrap items-center gap-2">
                      <FaMapMarkerAlt /> {t.address}
                    </p>
                  )}
                  {t.gstNumber && <p>GST&nbsp;{t.gstNumber}</p>}
                </>
              )}
            </div>
          ))}
        </div>
        {/* price */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-medium text-gray-800">Price Summary</h3>
          <p className="text-sm text-gray-700">
            Total Price:&nbsp;
            <span className="text-xl font-bold text-green-600">
              INR {bookingData.totalPrice}
            </span>
          </p>
        </div>
        <div className="text-sm text-gray-600 mt-4">
          <p>Please carry a valid ID proof and this ticket for boarding.</p>
          <p>
            Contact support at&nbsp;
            <a
              href="mailto:support@flyola.in"
              className="text-blue-600 underline"
            >
              support@flyola.in
            </a>
          </p>
        </div>
      </div>
      <button
        onClick={generatePDF}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <FaDownload /> Download Ticket PDF
      </button>
    </div>
  );
};

export default TicketComponent;
