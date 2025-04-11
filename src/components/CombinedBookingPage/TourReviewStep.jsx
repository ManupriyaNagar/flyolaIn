import React from "react";
import { FaPlane } from "react-icons/fa";

const TourReviewStep = ({ bookingData, handleNextStep, handlePreviousStep, step }) => {
  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Tour Review
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-800">Flight Detail</h3>
          <div className="mt-4 p-4 border border-gray-200 rounded-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FaPlane className="text-blue-600" />
              </div> 
              <div>
                <div className="flex items-center">
                  <div className="font-medium text-gray-700">Departure</div>
                  <div className="ml-2 text-sm text-gray-500">{bookingData.departure}</div>
                </div>
                <div className="flex items-center mt-2">
                  <div className="font-medium text-gray-700">Arrival</div>
                  <div className="ml-2 text-sm text-gray-500">{bookingData.arrival}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-800 mt-4">Good To Know</h3>
          <p className="mt-2 text-gray-600">
            All Prices are in Indian Rupees and are subject to change without prior notice.
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousStep}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
            disabled={step === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next: Traveler Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourReviewStep;