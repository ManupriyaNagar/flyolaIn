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

const CombinedBookingPage = () => {
  const [step, setStep] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [availableSeats, setAvailableSeats] = useState({});
  const router = useRouter();

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

        setAvailableSeats({
          [`${data.flightSchedule.id}_${data.selectedDate}`]: data.flightSchedule.availableSeats,
        });
      } catch (err) {
        console.error("Error parsing booking data:", err);
      }
    };
    fetchBookingData();
  }, []);

  useEffect(() => {
    function handleSeatUpdate(e) {
      const { schedule_id, bookDate, seatsLeft } = e.detail;
      setAvailableSeats((prev) => ({
        ...prev,
        [`${schedule_id}_${bookDate}`]:
          typeof seatsLeft === "number" && seatsLeft >= 0
            ? seatsLeft
            : prev[`${schedule_id}_${bookDate}`] ?? 0,
      }));
    }
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, []);

  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePreviousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConfirm = (bookingResult) => {
    const ticketData = {
      bookingData: {
        ...bookingData,
        bookingNo: bookingResult.bookingNo || `BOOK${Date.now()}`,
        bookingStatus: "CONFIRMED",
        paymentStatus: "SUCCESS",
        noOfPassengers: travelerDetails.length,
      },
      travelerDetails,
      bookingResult,
    };
    try {
      console.log("Storing ticketData:", ticketData);
      localStorage.setItem("ticketData", JSON.stringify(ticketData));
      console.log("Navigating to /ticket-page");
      router.push("/ticket-page");
    } catch (err) {
      console.error("Error storing ticketData:", err);
      alert("Failed to save booking data. Please try again.");
    }
  };

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center py-8 px-4 mt-20 md:mt-40">
        <p className="text-red-600">
          No booking data available. Please select a flight first.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 mt-20 md:mt-40">
      {step === 1 && (
        <TourReviewStep
          bookingData={bookingData}
          handleNextStep={handleNextStep}
          handlePreviousStep={step === 1 ? null : handlePreviousStep}
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
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default CombinedBookingPage;