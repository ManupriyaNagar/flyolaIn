"use client";

import React, { useState, useEffect } from "react";
import TourReviewStep from "./TourReviewStep";
import TravelerInfoStep from "./TravelerInfoStep";
import PaymentStep from "./PaymentStep";
import TicketComponent from "./TicketComponent";

const EMPTY_TRAVELLER = {
  title: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  address: "",
  phone: "",
  gstNumber: "",
};

const CombinedBookingPage = () => {
  const [step, setStep] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState([]);
  const [bookingData, setBookingData] = useState(null);

  /* ──────────────────────────────────────────────────────────────
     Read the data stored by BookingPopup and pre‑build the array
  ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchBookingData = () => {
      try {
        const storedData = localStorage.getItem("bookingData");
        if (!storedData) return console.error("No booking data found");

        const data = JSON.parse(storedData);
        const total =
          data.passengers.adults +
          data.passengers.children +
          data.passengers.infants;

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

        setTravelerDetails(
          Array.from({ length: total }, () => ({ ...EMPTY_TRAVELLER }))
        );
      } catch (err) {
        console.error("Error parsing booking data:", err);
      }
    };
    fetchBookingData();
  }, []);

  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const handlePreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  if (!bookingData)
    return (
      <div className="flex flex-col items-center py-8 px-4 mt-20 md:mt-40">
        <p className="text-red-600">
          No booking data available. Please select a flight first.
        </p>
      </div>
    );

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 mt-20 md:mt-40">
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
          bookingData={bookingData}
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
        <TicketComponent
          bookingData={bookingData}
          travelerDetails={travelerDetails}
        />
      )}
    </div>
  );
};

export default CombinedBookingPage;
