"use client";

import React from 'react';


const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Flyola</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your premier destination for luxury aviation services and unforgettable sky experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Jet Serve Aviation is a premier provider of private jet services, catering to travelers seeking luxury, comfort, and convenience. Founded with a vision to revolutionize air travel, we have been serving discerning clients with exceptional aviation solutions.
            </p>
            <p className="text-gray-600 mb-4">
              Our commitment to excellence, safety, and customer satisfaction has made us a trusted name in the aviation industry. We offer a comprehensive range of services from personal charters to business class flights, ensuring every journey is memorable.
            </p>
            <p className="text-gray-600">
              With our state-of-the-art aircraft and experienced crew, we provide unparalleled service that exceeds expectations every time you fly with us.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Why Choose Flyola?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Premium aircraft fleet
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Experienced pilots and crew
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                24/7 customer support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Flexible scheduling
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Competitive pricing
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">10+</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Years of Experience</h3>
            <p className="text-gray-600">Serving clients with excellence and reliability</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">50+</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aircraft Fleet</h3>
            <p className="text-gray-600">Modern and well-maintained aircraft</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1000+</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Happy Clients</h3>
            <p className="text-gray-600">Satisfied customers worldwide</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Charter</h3>
              <p className="text-gray-600">Exclusive private flights tailored to your schedule and preferences</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Class Charter</h3>
              <p className="text-gray-600">Premium business travel solutions for corporate clients</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Helicopter Hire</h3>
              <p className="text-gray-600">Helicopter services for short distances and special occasions</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Joy Rides</h3>
              <p className="text-gray-600">Scenic flights and aerial tours for unforgettable experiences</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scheduled Flights</h3>
              <p className="text-gray-600">Regular flight services between popular destinations</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Special Events</h3>
              <p className="text-gray-600">Aviation services for weddings, celebrations, and corporate events</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AboutPage;