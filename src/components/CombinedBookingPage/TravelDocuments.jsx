"use client";

import React, { useState } from "react";
import { 
  FaPassport, 
  FaIdCard, 
  FaFileAlt, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaDownload,
  FaPrint
} from "react-icons/fa";

const TravelDocuments = ({ bookingData }) => {
  const [checkedDocuments, setCheckedDocuments] = useState({});

  const requiredDocuments = [
    // {
    //   id: "passport",
    //   icon: FaPassport,
    //   title: "Valid Passport",
    //   description: "Must be valid for at least 6 months from travel date",
    //   required: true,
    //   color: "text-blue-500"
    // },
    // {
    //   id: "visa",
    //   icon: FaFileAlt,
    //   title: "Visa (if required)",
    //   description: "Check visa requirements for your destination",
    //   required: false,
    //   color: "text-green-500"
    // },
    {
      id: "id",
      icon: FaIdCard,
      title: "Government ID",
      description: "Aadhaar Card, Driving License, or Voter ID",
      required: true,
      color: "text-purple-500"
    },
    {
      id: "ticket",
      icon: FaFileAlt,
      title: "E-Ticket",
      description: "Print or mobile boarding pass",
      required: true,
      color: "text-orange-500"
    }
  ];

  const handleDocumentCheck = (docId) => {
    setCheckedDocuments(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const checkedCount = Object.values(checkedDocuments).filter(Boolean).length;
  const requiredCount = requiredDocuments.filter(doc => doc.required).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaFileAlt className="text-blue-600 text-2xl mr-3" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Travel Documents</h3>
            <p className="text-gray-600">Required documents for your journey</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Checklist Progress</div>
          <div className="text-lg font-bold text-blue-600">
            {checkedCount}/{requiredCount}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Document Checklist</span>
          <span>{Math.round((checkedCount / requiredCount) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / requiredCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4 mb-6">
        {requiredDocuments.map((doc) => {
          const IconComponent = doc.icon;
          const isChecked = checkedDocuments[doc.id];
          
          return (
            <div 
              key={doc.id} 
              className={`flex items-start p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                isChecked 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 hover:border-blue-300'
              }`}
              onClick={() => handleDocumentCheck(doc.id)}
            >
              <div className="flex items-center mr-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isChecked 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {isChecked && <FaCheckCircle className="text-white text-sm" />}
                </div>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                <IconComponent className={`${doc.color} text-lg`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                  {doc.required && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Travel Advisory */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-4">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-yellow-600 mr-3 mt-1" />
          <div>
            <h5 className="font-semibold text-yellow-800 mb-2">Important Reminders</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ensure all documents are original and not expired</li>
              <li>• Keep photocopies of important documents separately</li>
              <li>• Check destination-specific entry requirements</li>
              <li>• Arrive at airport with sufficient time for document verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FaDownload className="mr-2" />
          Download Checklist
        </button>
        <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <FaPrint className="mr-2" />
          Print Documents
        </button>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <FaInfoCircle className="mr-2" />
          Visa Info
        </button>
      </div>

      {/* Completion Message */}
      {checkedCount === requiredCount && (
        <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 mr-3" />
            <div>
              <h5 className="font-semibold text-green-800">All Set!</h5>
              <p className="text-sm text-green-700">
                You have all required documents ready for your journey.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDocuments;