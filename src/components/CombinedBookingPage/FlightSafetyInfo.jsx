"use client";

import React from "react";
import { 
  FaShieldAlt, 
  FaFirstAid, 
  FaExclamationTriangle, 
  FaLifeRing,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

const FlightSafetyInfo = () => {
  const safetyFeatures = [
    {
      icon: FaShieldAlt,
      title: "Enhanced Safety Protocols",
      description: "Latest safety measures and equipment onboard",
      color: "text-green-500"
    },
    {
      icon: FaFirstAid,
      title: "Medical Assistance",
      description: "Trained crew and medical equipment available",
      color: "text-red-500"
    },
    {
      icon: FaLifeRing,
      title: "Emergency Procedures",
      description: "Comprehensive safety briefing before takeoff",
      color: "text-blue-500"
    },
    {
      icon: FaCheckCircle,
      title: "Aircraft Maintenance",
      description: "Regular inspections and certified maintenance",
      color: "text-purple-500"
    }
  ];

  const safetyTips = [
    "Arrive at airport 2 hours before domestic flights",
    "Keep important documents easily accessible",
    "Follow crew instructions during safety demonstrations",
    "Ensure electronic devices are in airplane mode",
    "Keep seat belt fastened when seated",
    "Familiarize yourself with emergency exits"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <FaShieldAlt className="text-green-600 text-2xl mr-3" />
        <div>
          <h3 className="text-xl font-bold text-gray-800">Flight Safety Information</h3>
          <p className="text-gray-600">Your safety is our top priority</p>
        </div>
      </div>

      {/* Safety Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {safetyFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                <IconComponent className={`${feature.color} text-lg`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center mb-3">
          <FaInfoCircle className="text-blue-600 mr-2" />
          <h4 className="font-semibold text-blue-800">Safety Tips for Travelers</h4>
        </div>
        <ul className="space-y-2">
          {safetyTips.map((tip, index) => (
            <li key={index} className="flex items-start text-sm text-blue-700">
              <FaCheckCircle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" size={12} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Contact */}
      <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
        <div className="flex items-center mb-2">
          <FaExclamationTriangle className="text-red-600 mr-2" />
          <h4 className="font-semibold text-red-800">Emergency Contact</h4>
        </div>
        <p className="text-sm text-red-700">
          For any emergency assistance: <span className="font-bold">+91-1800-XXX-XXXX</span>
        </p>
        <p className="text-xs text-red-600 mt-1">Available 24/7 for passenger support</p>
      </div>
    </div>
  );
};

export default FlightSafetyInfo;