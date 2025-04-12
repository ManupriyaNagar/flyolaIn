"use client";

import React, { useEffect } from "react";
import { FaPlane, FaClock, FaUserFriends, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TicketComponent = ({ bookingData, travelerDetails }) => {
  const totalPassengers = bookingData.passengers.adults + bookingData.passengers.children + bookingData.passengers.infants;
  const ticketNumber = `TICKET-${Date.now().toString(36).toUpperCase()}`;

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

  useEffect(() => {
    // Replace oklch colors before generating PDF
    const elements = document.getElementsByTagName("*");
    for (let element of elements) {
      const styles = window.getComputedStyle(element);
      for (let prop of styles) {
        if (styles[prop].includes("oklch")) {
          element.style[prop] = "rgb(30, 64, 175)"; // Fallback color (e.g., blue)
        }
      }
    }

    // Automatically generate and download PDF when component mounts
    generatePDF();
  }, [bookingData, travelerDetails]);

  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">Flight Ticket</h2>
      <div className="border-b border-gray-300 pb-4 mb-4">
        <p className="text-lg font-medium text-gray-800">Ticket Number: <span className="font-bold">{ticketNumber}</span></p>
      </div>

      <div id="ticket-content" className="space-y-4">
        {/* Flight Details */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-medium text-gray-800">Flight Information</h3>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaPlane className="text-indigo-500" />
            From: <span className="font-semibold">{bookingData.departure}</span> To: <span className="font-semibold">{bookingData.arrival}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" />
            Date: <span className="font-semibold">{bookingData.selectedDate}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" />
            Departure: <span className="font-semibold">{bookingData.departureTime}</span> - Arrival: <span className="font-semibold">{bookingData.arrivalTime}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaUserFriends className="text-gray-500" />
            Passengers: <span className="font-semibold">
              Adults: {bookingData.passengers.adults}, Children: {bookingData.passengers.children}, Infants: {bookingData.passengers.infants}
              (Total: {totalPassengers})
            </span>
          </p>
          <p className="text-sm text-gray-700">
            Flight ID: <span className="font-semibold">{bookingData.id}</span>
          </p>
        </div>

        {/* Traveler Details */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-medium text-gray-800">Traveler Information</h3>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaUserFriends className="text-gray-500" />
            Title: <span className="font-semibold">{travelerDetails.title}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            Full Name: <span className="font-semibold">{travelerDetails.fullName}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            Date of Birth: <span className="font-semibold">{travelerDetails.dateOfBirth}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaEnvelope className="text-gray-500" />
            Email: <span className="font-semibold">{travelerDetails.email}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            Phone: <span className="font-semibold">{travelerDetails.phone}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            Address: <span className="font-semibold">{travelerDetails.address}</span>
          </p>
          {travelerDetails.gstNumber && (
            <p className="text-sm text-gray-700">
              GST Number: <span className="font-semibold">{travelerDetails.gstNumber}</span>
            </p>
          )}
        </div>

        {/* Price Details */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-medium text-gray-800">Price Summary</h3>
          <p className="text-sm text-gray-700">
            Total Price: <span className="text-xl font-bold text-green-600">INR {bookingData.totalPrice}</span>
          </p>
        </div>

        {/* Additional Notes */}
        <div className="text-sm text-gray-600 mt-4">
          <p>Please carry a valid ID proof and this ticket for boarding.</p>
          <p>Contact support at <a href="mailto:support@flyola.in" className="text-blue-600 underline">support@flyola.in</a> for assistance.</p>
        </div>
      </div>

      {/* Download Button */}
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