"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TourReviewStep from "./TourReviewStep";
import TravelerInfoStep from "./TravelerInfoStep";
import PaymentStep from "./PaymentStep";

const EMPTY_TRAVELLER = {
  title: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  address: "",
  phone: "",
  gstNumber: "",
};

export default function CombinedBookingPage() {
  const [step, setStep] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const router = useRouter();

  // load bookingData stub from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("bookingData");
    if (!raw) return;
    const data = JSON.parse(raw);
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
    setTravelerDetails(Array.from({ length: total }, () => ({ ...EMPTY_TRAVELLER })));
  }, []);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleConfirm = (bookingResult) => {
    const ticketData = {
      bookingData: {
        ...bookingData,
        bookingNo: bookingResult.bookingNo,
        bookingStatus: bookingResult.bookingStatus,
        paymentStatus: bookingResult.paymentStatus,
        noOfPassengers: travelerDetails.length,
      },
      travelerDetails,
      bookingResult,
    };
    localStorage.setItem("ticketData", JSON.stringify(ticketData));
    router.push("/ticket-page");
  };

  if (!bookingData) {
    return (
      <div className="py-20 text-center text-red-600">
        No booking data found. Please select a flight first.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {step === 1 && (
        <TourReviewStep
          bookingData={bookingData}
          handleNextStep={handleNext}
          handlePreviousStep={null}
          step={step}
        />
      )}
      {step === 2 && (
        <TravelerInfoStep
          travelerDetails={travelerDetails}
          setTravelerDetails={setTravelerDetails}
          handleNextStep={handleNext}
          handlePreviousStep={handlePrev}
          bookingData={bookingData}
        />
      )}
      {step === 3 && (
        <PaymentStep
          bookingData={bookingData}
          travelerDetails={travelerDetails}
          handlePreviousStep={handlePrev}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
