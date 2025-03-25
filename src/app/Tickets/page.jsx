"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DownloadTicketsPage() {
  // State for form inputs
  const [formData, setFormData] = useState({
    bookingId: "",
    email: "",
  });

  // State for ticket preview
  const [ticket, setTicket] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mock ticket generation (replace with actual API call in production)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate ticket generation
    setTicket({
      bookingId: formData.bookingId,
      passengerName: "John Doe", // This would come from your backend
      flightNumber: "FLY123",
      departure: "New York (JFK)",
      destination: "London (LHR)",
      date: "April 15, 2025",
      time: "14:30",
    });
  };

  // Handle ticket download (mock function)
  const handleDownload = () => {
    alert("Ticket download initiated! (This is a mock action)");
    // In production, this would generate and download a PDF
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-30">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Download Your Flyola Tickets
          </motion.h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Enter your booking details to retrieve and download your flight tickets instantly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Retrieve Your Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="bookingId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Booking ID
                </label>
                <input
                  type="text"
                  id="bookingId"
                  name="bookingId"
                  value={formData.bookingId}
                  onChange={handleInputChange}
                  placeholder="e.g., FLY123456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., john.doe@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Get Ticket
              </button>
            </form>
          </motion.div>

          {/* Ticket Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2"
          >
            {ticket ? (
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    Flyola Ticket
                  </h3>
                  <Image
                    src="https://via.placeholder.com/100x40?text=Flyola" // Replace with your logo
                    alt="Flyola Logo"
                    width={100}
                    height={40}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-medium">{ticket.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flight Number</p>
                    <p className="font-medium">{ticket.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passenger</p>
                    <p className="font-medium">{ticket.passengerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{ticket.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-medium">{ticket.departure}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="font-medium">{ticket.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{ticket.time}</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Download Ticket
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Please enter your details to preview your ticket</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}