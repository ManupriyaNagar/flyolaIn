"use client";

import React from "react";
import { FaCheck, FaUser, FaCreditCard, FaEye } from "react-icons/fa";

const BookingProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, title: "Review", icon: FaEye, description: "Flight Details" },
    { id: 2, title: "Details", icon: FaUser, description: "Passenger Info" },
    { id: 3, title: "Payment", icon: FaCreditCard, description: "Secure Payment" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4 md:space-x-8">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const IconComponent = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      <IconComponent className="text-sm" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`
                        text-sm font-semibold
                        ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                      `}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden md:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-16 md:w-24 h-0.5 transition-all duration-300
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;