"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TourReviewStep from "./TourReviewStep";
import TravelerInfoStep from "./TravelerInfoStep";
import BookingProgress from "./BookingProgress";
import BookingSummary from "./BookingSummary";
import BookingHeader from "./BookingHeader";
import FlightInsights from "./FlightInsights";
import WeatherInfo from "./WeatherInfo";
import FlightSafetyInfo from "./FlightSafetyInfo";
import TravelDocuments from "./TravelDocuments";
import AirportServices from "./AirportServices";

import FlightRecommendations from "./FlightRecommendations";


import { useAuth } from "../AuthContext";

const PaymentStep = dynamic(() => import("./PaymentStep"), { ssr: false });

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
  console.log("[CombinedBookingPage] authState:", authState); // Debug
  const token = authState.token || localStorage.getItem("token");
  console.log("[CombinedBookingPage] Token:", token);
  console.log("[CombinedBookingPage] User role:", authState.user?.role); // Debug
  if (!token) {
    alert("Please log in to continue.");
    router.push("/sign-in");
    return;
  }
  // ... rest of the code


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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Enhanced Header */}
        <BookingHeader bookingData={bookingData} currentStep={step} />

        {/* Progress Indicator */}
        <BookingProgress currentStep={step} />

        {/* Enhanced Flight Information Section */}
        {step === 1 && (
          <div className="mb-8 space-y-6">
            {/* Flight Status & Insights */}
            <div className="grid gap-6">

              <TourReviewStep
                  bookingData={bookingData}
                  handleNextStep={handleNext}
                  handlePreviousStep={null}
                  step={step}
                />
     
            </div>
            
            {/* Travel Services */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FlightComparison bookingData={bookingData} />
              <TravelInsurance bookingData={bookingData} />
            </div>
             */}
            {/* Safety & Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FlightSafetyInfo />
              <TravelDocuments bookingData={bookingData} />
            </div>
            
            {/* Airport Services */}
            <AirportServices bookingData={bookingData} />
            
            {/* Travel Guide */}
 
            
            {/* Flight Recommendations */}
            <FlightRecommendations currentBooking={bookingData} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {step === 1 && (
              <>
                      <FlightInsights bookingData={bookingData} />
                <WeatherInfo bookingData={bookingData} />
              </>
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
                isAdmin={authState.user?.role === "1"}
                isAgent={authState.user?.role === "2"}
              />
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-96">
            <BookingSummary 
              bookingData={bookingData}
              travelerDetails={travelerDetails}
              currentStep={step}
            />
          </div>
        </div>
      </div>
    </div>
  );
}