'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaEnvelope, FaTicketAlt, FaPlane } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TicketView from './../../components/Ticket/TicketView'; // Adjust path to where TicketView is located
import axios from 'axios';

const FlightInquiryForm = () => {
  const [formData, setFormData] = useState({
    searchOption: 'pnr',
    pnr: '',
    name: '',
    email: '',
  });
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setBooking(null);
    setShowTicket(false);

    try {
      const baseUrl = 'http://localhost:4000'; // Replace with your actual BASE_URL
      let response;

      if (formData.searchOption === 'pnr') {
        if (!formData.pnr || formData.pnr.length < 6) {
          toast.error('Please enter a valid PNR (at least 6 characters).');
          setIsLoading(false);
          return;
        }
        response = await axios.get(`${baseUrl}/bookings/pnr`, {
          params: { pnr: formData.pnr },
          auth: {
            username: 'kshitizmaurya6@gmail.com',
            password: 'augs snhv vjmw njfg',
          },
        });
      } else {
        if (!formData.name || !formData.email) {
          toast.error('Please enter both name and email.');
          setIsLoading(false);
          return;
        }
        response = await axios.get(`${baseUrl}/bookings/by-user`, {
          params: { name: formData.name, email: formData.email },
          auth: {
            username: 'kshitizmaurya6@gmail.com',
            password: 'augs snhv vjmw njfg',
          },
        });
      }

      if (response.data && (formData.searchOption === 'pnr' || response.data.length > 0)) {
        const bookingData = formData.searchOption === 'pnr' ? response.data : response.data[0];
        setBooking(bookingData);
        setShowTicket(true);
        toast.success('Booking details fetched successfully!');
      } else {
        toast.error('No booking found for the provided details.');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch booking details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
    setBooking(null);
    setFormData({
      searchOption: 'pnr',
      pnr: '',
      name: '',
      email: '',
    });
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen py-20 px-6 md:px-12 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-blue-100"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight"
          >
            Flight Inquiry
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-blue-700 mt-2"
          >
            Check your flight details with ease using your PNR or name and email.
          </motion.p>
          <svg
            className="w-16 h-16 mx-auto mt-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Radio Buttons for Search Option */}
          <div className="space-y-2">
            <Label className="text-blue-700 font-medium">Search By</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="pnr"
                  name="searchOption"
                  type="radio"
                  value="pnr"
                  checked={formData.searchOption === 'pnr'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="pnr" className="ml-2 text-blue-700">
                  PNR
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  id="name"
                  name="searchOption"
                  type="radio"
                  value="name"
                  checked={formData.searchOption === 'name'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <Label htmlFor="name" className="ml-2 text-blue-700">
                  Name and Email
                </Label>
              </div>
            </div>
          </div>

          {/* Conditional Input for PNR or Name */}
          {formData.searchOption === 'pnr' ? (
            <div className="relative">
              <Label htmlFor="pnr" className="text-blue-700 font-medium">
                PNR Number
              </Label>
              <div className="relative mt-1">
                <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                <Input
                  id="pnr"
                  name="pnr"
                  type="text"
                  placeholder="Enter your PNR number"
                  value={formData.pnr}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <Label htmlFor="name" className="text-blue-700 font-medium">
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <FaTicketAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="email" className="text-blue-700 font-medium">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-blue-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 w-full font-medium text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Loading...
              </>
            ) : (
              <>
                <FaPlane /> Submit Inquiry
              </>
            )}
          </Button>
        </form>
      </motion.div>

      {/* Ticket View Modal */}
      {showTicket && booking && (
        <TicketView
          isOpen={true}
          onClose={handleCloseTicket}
          booking={booking}
        />
      )}

      {/* Decorative SVG Background */}
      <svg
        className="absolute bottom-0 left-0 w-full h-32 text-blue-300 opacity-20"
        fill="none"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </section>
  );
};

export default FlightInquiryForm;