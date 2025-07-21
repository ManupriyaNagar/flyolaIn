"use client";

import React from 'react';


const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Terms & Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 21, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Flyola's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Booking and Payment</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All bookings are subject to availability and confirmation</li>
                <li>Payment must be made in full at the time of booking</li>
                <li>We accept major credit cards, debit cards, and online payment methods</li>
                <li>All prices are quoted in Indian Rupees (INR) unless otherwise specified</li>
                <li>Prices may vary based on demand, seasonality, and other factors</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Passenger Requirements</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Valid government-issued photo identification is required for all passengers</li>
                <li>Passengers must arrive at the departure point at least 30 minutes before scheduled departure</li>
                <li>Weight restrictions may apply for certain aircraft types</li>
                <li>Passengers must comply with all safety instructions from crew members</li>
                <li>Intoxicated passengers or those under the influence of drugs will be denied boarding</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Baggage Policy</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Baggage allowances vary by aircraft type and service</li>
                <li>Excess baggage charges may apply</li>
                <li>Prohibited items as per aviation regulations are not allowed</li>
                <li>Flyola is not responsible for lost or damaged baggage beyond statutory limits</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Flight Operations</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Flight schedules are subject to weather conditions and operational requirements</li>
                <li>Flyola reserves the right to cancel or reschedule flights for safety reasons</li>
                <li>Alternative arrangements will be made in case of cancellations due to operational reasons</li>
                <li>No compensation is payable for delays or cancellations due to weather or circumstances beyond our control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liability and Insurance</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All flights are covered by comprehensive aviation insurance</li>
                <li>Flyola's liability is limited as per applicable aviation laws</li>
                <li>Passengers are advised to obtain travel insurance for additional coverage</li>
                <li>We are not liable for indirect or consequential damages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Personal information is collected and used as per our Privacy Policy</li>
                <li>Data may be shared with regulatory authorities as required by law</li>
                <li>We implement appropriate security measures to protect your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Conduct</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Disruptive behavior that compromises safety or comfort of other passengers</li>
                <li>Smoking or use of electronic cigarettes on board aircraft</li>
                <li>Carrying prohibited items as per aviation security regulations</li>
                <li>Non-compliance with crew instructions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These terms and conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the jurisdiction of Indian courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For any questions regarding these terms and conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600"><strong>Company:</strong> Jet Serve Aviation Pvt. Ltd.</p>
                <p className="text-gray-600"><strong>Phone:</strong> +91 9311896389, +91 9202961237</p>
                <p className="text-gray-600"><strong>Email:</strong> legal@flyola.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications</h2>
              <p className="text-gray-600">
                Flyola reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>
          </div>
        </div>
      </div>


    </div>
  );
};

export default TermsConditionsPage;