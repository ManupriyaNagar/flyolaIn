
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
    const storedData = localStorage.getItem("bookingData");
    if (storedData) {
      setBookingData(JSON.parse(storedData));
      localStorage.removeItem("bookingData"); // Clear after use
    }
  }, []);

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 mt-40">
      {step === 1 && bookingData && (
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

      {step === 3 && bookingData && (
        <PaymentStep
          bookingData={bookingData}
          handlePreviousStep={handlePreviousStep}
          onConfirm={() => setStep(4)} // Move to confirmation step after payment
        />
      )}
    </div>
  );
};

export default CombinedBookingPage;