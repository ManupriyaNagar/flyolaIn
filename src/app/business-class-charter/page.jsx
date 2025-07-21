"use client";

import React from 'react';


const BusinessClassCharterPage = () => {
  const features = [
    {
      title: "Executive Seating",
      description: "Spacious leather seats that recline to fully flat beds",
      icon: "🪑"
    },
    {
      title: "High-Speed Connectivity",
      description: "Satellite Wi-Fi and communication systems for seamless business operations",
      icon: "📶"
    },
    {
      title: "Conference Facilities",
      description: "Onboard meeting spaces with presentation capabilities",
      icon: "💼"
    },
    {
      title: "Gourmet Catering",
      description: "Premium dining options prepared by top chefs",
      icon: "🍽️"
    }
  ];

  const aircraft = [
    {
      name: "Citation CJ3+",
      capacity: "6-8 passengers",
      range: "2,040 nm",
      features: ["Executive interior", "Advanced avionics", "Quiet cabin"]
    },
    {
      name: "Hawker 850XP",
      capacity: "8-9 passengers", 
      range: "2,642 nm",
      features: ["Spacious cabin", "High-speed cruise", "Excellent range"]
    },
    {
      name: "Citation Sovereign",
      capacity: "9-12 passengers",
      range: "3,200 nm",
      features: ["Large cabin", "Transcontinental range", "Superior comfort"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Business Class Charter</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Elevate your business travel with our premium charter services. Experience unparalleled comfort, 
              productivity, and efficiency while traveling to your most important meetings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200">
                Request Quote
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors duration-200">
                View Fleet
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Why Choose Business Charter */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Business Class Charter?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your business travel experience with our premium charter solutions designed for executives and corporate teams
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Aircraft Fleet */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Business Charter Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aircraft.map((plane, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">{plane.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{plane.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600"><strong>Capacity:</strong> {plane.capacity}</p>
                    <p className="text-gray-600"><strong>Range:</strong> {plane.range}</p>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {plane.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services & Amenities */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Premium Services & Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">In-Flight Business Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• High-speed satellite internet</li>
                  <li>• Video conferencing capabilities</li>
                  <li>• Power outlets at every seat</li>
                  <li>• Printing and fax services</li>
                  <li>• Private phone lines</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Luxury Amenities</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Premium leather seating</li>
                  <li>• Fully stocked bar</li>
                  <li>• Gourmet catering options</li>
                  <li>• Entertainment systems</li>
                  <li>• Climate-controlled cabin</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ground Services</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• VIP terminal access</li>
                  <li>• Expedited security screening</li>
                  <li>• Luxury ground transportation</li>
                  <li>• Concierge services</li>
                  <li>• 24/7 flight support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Business Benefits */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Business Advantages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Time Efficiency</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Skip commercial airline delays</li>
                  <li>• Fly direct to your destination</li>
                  <li>• Flexible departure times</li>
                  <li>• Multiple meetings in one day</li>
                  <li>• Reduced travel fatigue</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Productivity Enhancement</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Conduct meetings in-flight</li>
                  <li>• Confidential business discussions</li>
                  <li>• Uninterrupted work environment</li>
                  <li>• Prepare for important meetings</li>
                  <li>• Team collaboration space</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Booking */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Business Travel?</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Contact our business aviation specialists for customized charter solutions and competitive pricing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span className="text-lg font-semibold">+91 9311896389, +91 9202961237</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✉️</span>
              <span className="text-lg font-semibold">business@flyola.com</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Get Custom Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Schedule Consultation
            </button>
          </div>
        </section>
      </div>


    </div>
  );
};

export default BusinessClassCharterPage;