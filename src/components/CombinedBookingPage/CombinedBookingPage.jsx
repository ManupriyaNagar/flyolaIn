"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TourReviewStep from "./TourReviewStep";
import TravelerInfoStep from "./TravelerInfoStep";
import PaymentStep from "./PaymentStep";
import { useAuth } from "../AuthContext";

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
  const { authState } = useAuth();

  useEffect(() => {
    console.log("Checking auth state:", authState);
    const token = authState.token || localStorage.getItem("token");
    console.log("Token in CombinedBookingPage:", token);
    if (!token) {
      alert("Please log in to continue.");
      router.push("/sign-in");
      return;
    }

    const raw = localStorage.getItem("bookingData");
    if (!raw) {
      console.error("No booking data found in localStorage");
      alert("No booking data found. Please select a flight first.");
      router.push("/scheduled-flights");
      return;
    }
    try {
      const data = JSON.parse(raw);
      console.log("Loaded booking data:", data);
      const total =
        data.passengers.adults +
        data.passengers.children +
        data.passengers.infants;

      setBookingData({
        departure: data.departure,
        arrival: data.arrival,
        totalPrice: data.totalPrice.toString(),
        id: Number(data.flightSchedule.id), // Ensure id is a number
        departureTime: data.flightSchedule.departure_time,
        arrivalTime: data.flightSchedule.arrival_time,
        selectedDate: data.selectedDate,
        passengers: data.passengers,
        selectedSeats: Array.isArray(data.selectedSeats) ? data.selectedSeats : [],
      });
      setTravelerDetails(Array.from({ length: total }, () => ({ ...EMPTY_TRAVELLER })));
    } catch (err) {
      console.error("Error parsing booking data:", err);
      alert("Invalid booking data. Please select a flight again.");
      router.push("/scheduled-flights");
    }
  }, [authState, router]);

  function handleNext() {
    setStep((s) => Math.min(s + 1, 3));
  }

  function handlePrev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleConfirm(bookingResult) {
    console.log("Booking result received:", bookingResult);
    const ticketData = {
      bookingData: {
        ...bookingData,
        bookingNo: bookingResult.bookingNo,
        bookingStatus: bookingResult.bookingStatus,
        paymentStatus: bookingResult.paymentStatus,
        noOfPassengers: travelerDetails.length,
        selectedSeats: bookingData.selectedSeats,
      },
      travelerDetails,
      bookingResult,
    };
    console.log("Storing ticket data:", ticketData);
    localStorage.setItem("ticketData", JSON.stringify(ticketData));
    router.push("/ticket-page");
  }

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