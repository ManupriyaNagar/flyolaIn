"use client";

import React from 'react';


const JetHirePage = () => {
  const jetTypes = [
    {
      name: "Light Jets",
      capacity: "4-6 passengers",
      range: "1,500-2,500 km",
      features: ["Ideal for short trips", "Cost-effective", "Quick boarding"],
      image: "/api/placeholder/300/200"
    },
    {
      name: "Mid-Size Jets",
      capacity: "6-8 passengers", 
      range: "2,500-4,000 km",
      features: ["Perfect for medium distances", "More cabin space", "Enhanced comfort"],
      image: "/api/placeholder/300/200"
    },
    {
      name: "Heavy Jets",
      capacity: "8-14 passengers",
      range: "4,000+ km",
      features: ["Long-range flights", "Luxury amenities", "Maximum comfort"],
      image: "/api/placeholder/300/200"
    }
  ];

  const benefits = [
    {
      title: "Flexible Scheduling",
      description: "Fly on your schedule, not ours. Depart when you want.",
      icon: "🕒"
    },
    {
      title: "Privacy & Comfort",
      description: "Enjoy complete privacy with luxury amenities onboard.",
      icon: "✈️"
    },
    {
      title: "Time Efficiency",
      description: "Skip long queues and reach your destination faster.",
      icon: "⚡"
    },
    {
      title: "Access to More Airports",
      description: "Land closer to your final destination with access to smaller airports.",
      icon: "🛬"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Private Jet Hire Services</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Experience the ultimate in luxury travel with our premium private jet hire services. 
              Fly in comfort, style, and on your own schedule.
            </p>
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
              Get Quote Now
            </button>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Jet Types Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Jet Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {jetTypes.map((jet, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{jet.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{jet.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600"><strong>Capacity:</strong> {jet.capacity}</p>
                    <p className="text-gray-600"><strong>Range:</strong> {jet.range}</p>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {jet.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Private Jet Hire?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Jet Hire Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Travel</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Executive travel solutions</li>
                  <li>• Multi-city business trips</li>
                  <li>• Corporate group travel</li>
                  <li>• Last-minute business flights</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Leisure Travel</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Family vacations</li>
                  <li>• Romantic getaways</li>
                  <li>• Special occasion flights</li>
                  <li>• Group leisure trips</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Events</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Wedding transportation</li>
                  <li>• Sports events</li>
                  <li>• Concerts and shows</li>
                  <li>• VIP event transport</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Medical emergencies</li>
                  <li>• Urgent business travel</li>
                  <li>• Family emergencies</li>
                  <li>• 24/7 availability</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Simple Booking Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Quote</h3>
              <p className="text-gray-600">Tell us your travel requirements and get an instant quote</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Aircraft</h3>
              <p className="text-gray-600">Select the perfect jet for your needs and budget</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Booking</h3>
              <p className="text-gray-600">Secure your flight with payment and confirmation</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fly in Luxury</h3>
              <p className="text-gray-600">Enjoy your premium flight experience</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Private Jet?</h2>
          <p className="text-xl mb-6">
            Contact our aviation experts for personalized service and competitive pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span className="text-lg font-semibold">+91 9311896389, +91 9202961237</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✉️</span>
              <span className="text-lg font-semibold">jets@flyola.com</span>
            </div>
          </div>
          <button className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Get Your Quote Today
          </button>
        </section>
      </div>


    </div>
  );
};

export default JetHirePage;