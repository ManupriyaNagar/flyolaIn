"use client";

import React, { useState, useEffect } from "react";
import TourReviewStep from "./TourReviewStep";
import TravelerInfoStep from "./TravelerInfoStep";
import PaymentStep from "./PaymentStep";

const CombinedBookingPage = () => {
  const [step, setStep] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState({
    title: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    address: "",
    phone: "",
    gstNumber: "",
  });
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchBookingData = () => {
      try {
        const storedData = localStorage.getItem("bookingData");
        if (storedData) {
          const data = JSON.parse(storedData);
          setBookingData({
            departure: data.departure,
            arrival: data.arrival,
            totalPrice: data.totalPrice.toString(),
            id: data.flightSchedule.id.toString(),
            departureTime: data.flightSchedule.departure_time,
            arrivalTime: data.flightSchedule.arrival_time,
            selectedDate: data.selectedDate,
            passengers: data.passengers,
          });
        } else {
          console.error("No booking data found in localStorage");
        }
      } catch (err) {
        console.error("Error parsing booking data from localStorage:", err);
      }
    };
    fetchBookingData();
  }, []);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center py-8 px-4 mt-40">
        <p className="text-red-600">No booking data available. Please select a flight first.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 mt-40">
      {step === 1 && (
        <TourReviewStep
          bookingData={bookingData}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          step={step}
        />
      )}
      {step === 2 && (
        <TravelerInfoStep
          travelerDetails={travelerDetails}
          setTravelerDetails={setTravelerDetails}
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
        />
      )}
      {step === 3 && (
        <PaymentStep
          bookingData={bookingData}
          travelerDetails={travelerDetails}
          handlePreviousStep={handlePreviousStep}
          onConfirm={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Booking Confirmed!</h2>
          <p>Your flight from {bookingData.departure} to {bookingData.arrival} has been booked successfully.</p>
        </div>
      )}
    </div>
  );
};

export default CombinedBookingPage;