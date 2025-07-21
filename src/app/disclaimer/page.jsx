"use client";

import React from 'react';


const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className=" px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Disclaimer</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> January 21, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">General Information</h2>
              <p className="text-gray-600 mb-4">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Jet Serve Aviation Pvt. Ltd. (Flyola) excludes all representations, warranties, obligations, and liabilities arising out of or in connection with this website and its contents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Flight schedules and availability are subject to change without prior notice</li>
                <li>Weather conditions may affect flight operations and schedules</li>
                <li>Aircraft availability depends on maintenance schedules and operational requirements</li>
                <li>We reserve the right to cancel or modify services due to circumstances beyond our control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing and Booking</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All prices displayed are subject to change without notice</li>
                <li>Final pricing may vary based on specific requirements and availability</li>
                <li>Booking confirmation is subject to payment processing and verification</li>
                <li>Additional charges may apply for special requests or services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety and Regulations</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All flights operate under applicable aviation safety regulations</li>
                <li>Passenger safety is our top priority and may override commercial considerations</li>
                <li>Flight operations are subject to regulatory approvals and clearances</li>
                <li>Weather-related cancellations are made in the interest of passenger safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>We may use third-party service providers for various aspects of our operations</li>
                <li>We are not responsible for the actions or omissions of third-party providers</li>
                <li>Ground handling, catering, and other services may be provided by external vendors</li>
                <li>Links to third-party websites are provided for convenience only</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <p className="text-yellow-800 font-semibold mb-2">Important Notice:</p>
                <p className="text-yellow-700">
                  To the maximum extent permitted by applicable law, Flyola shall not be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever.
                </p>
              </div>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Our liability is limited to the extent permitted by applicable aviation laws</li>
                <li>We are not liable for delays, cancellations due to weather or force majeure events</li>
                <li>Compensation, if any, will be as per applicable regulations and our terms of service</li>
                <li>We recommend passengers obtain appropriate travel insurance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical and Health Considerations</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Passengers with medical conditions should consult their physician before flying</li>
                <li>We are not responsible for medical emergencies during flight</li>
                <li>Pregnant passengers and those with specific health conditions may have restrictions</li>
                <li>Medical clearance may be required for certain passengers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Force Majeure</h2>
              <p className="text-gray-600 mb-4">
                Flyola shall not be liable for any failure or delay in performance under this agreement which is due to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Weather conditions, natural disasters, or acts of God</li>
                <li>Government actions, regulations, or restrictions</li>
                <li>Labor strikes, equipment failures, or technical issues</li>
                <li>Any other circumstances beyond our reasonable control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>All content on this website is protected by copyright and other intellectual property laws</li>
                <li>Unauthorized use, reproduction, or distribution is prohibited</li>
                <li>Trademarks and logos are the property of their respective owners</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                For any questions regarding this disclaimer, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600"><strong>Company:</strong> Jet Serve Aviation Pvt. Ltd.</p>
                <p className="text-gray-600"><strong>Phone:</strong> +91 9311896389, +91 9202961237</p>
                <p className="text-gray-600"><strong>Email:</strong> info@flyola.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to Disclaimer</h2>
              <p className="text-gray-600">
                This disclaimer may be updated from time to time. Any changes will be posted on this page with an updated revision date. Your continued use of our services after any changes constitutes acceptance of the updated disclaimer.
              </p>
            </section>
          </div>
        </div>
      </div>


    </div>
  );
};

export default DisclaimerPage;