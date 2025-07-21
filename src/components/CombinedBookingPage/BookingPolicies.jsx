"use client";

import React, { useState } from "react";
import { 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaClock,
  FaSuitcase,
  FaPlane
} from "react-icons/fa";

const BookingPolicies = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const policies = [
    {
      id: 'cancellation',
      title: 'Cancellation Policy',
      icon: FaExclamationTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      content: [
        'Free cancellation up to 24 hours before departure',
        'Cancellation charges: 25% of ticket price (24-12 hours before)',
        'Cancellation charges: 50% of ticket price (12-2 hours before)',
        'No refund for cancellations within 2 hours of departure',
        'Processing fee of ₹200 applies to all cancellations'
      ]
    },
    {
      id: 'baggage',
      title: 'Baggage Policy',
      icon: FaSuitcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      content: [
        'Check-in baggage: 20kg included in ticket price',
        'Cabin baggage: 7kg + 1 personal item',
        'Excess baggage charges: ₹300 per kg',
        'Prohibited items: Liquids over 100ml, sharp objects',
        'Special baggage (sports equipment) requires prior approval'
      ]
    },
    {
      id: 'checkin',
      title: 'Check-in Policy',
      icon: FaClock,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      content: [
        'Online check-in opens 48 hours before departure',
        'Airport check-in counter opens 3 hours before departure',
        'Check-in closes 45 minutes before departure',
        'Arrive at airport at least 2 hours before domestic flights',
        'Valid government-issued photo ID required'
      ]
    },
    {
      id: 'changes',
      title: 'Date Change Policy',
      icon: FaPlane,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      content: [
        'Date changes allowed up to 4 hours before departure',
        'Change fee: ₹1,500 + fare difference (if applicable)',
        'Same route changes only (departure/arrival cities cannot change)',
        'Changes subject to seat availability',
        'Maximum 3 changes allowed per booking'
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <FaShieldAlt className="mr-2 text-blue-600" />
        Booking Policies & Terms
      </h3>
      
      <div className="space-y-4">
        {policies.map((policy) => {
          const IconComponent = policy.icon;
          const isExpanded = expandedSection === policy.id;
          
          return (
            <div key={policy.id} className={`border rounded-lg ${policy.borderColor}`}>
              <button
                onClick={() => toggleSection(policy.id)}
                className={`w-full p-4 ${policy.bgColor} rounded-lg flex items-center justify-between hover:opacity-80 transition-opacity duration-200`}
              >
                <div className="flex items-center">
                  <IconComponent className={`mr-3 ${policy.color}`} />
                  <span className="font-semibold text-gray-800">{policy.title}</span>
                </div>
                {isExpanded ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              
              {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                  <ul className="space-y-2">
                    {policy.content.map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Important Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <FaInfoCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
            <p className="text-sm text-yellow-700">
              By proceeding with this booking, you acknowledge that you have read and agree to all the above policies. 
              These terms are subject to change without prior notice. For detailed terms and conditions, please visit our website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPolicies;