import React from "react";

const services = [
  {
    title: "Personal Charter",
    image: "/images/personal-charter.jpg",
  },
  {
    title: "Helicopter Hire",
    image: "/images/helicopter-hire.jpg",
  },
  {
    title: "Jet Hire",
    image: "/images/jet-hire.jpg",
  },
  {
    title: "Business Class Charter",
    image: "/images/business-class.jpg",
  },
];

const PrivateJetRental = () => {
  return (
    <section className="text-center py-12 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <span className="bg-yellow-400 text-black px-4 py-1 text-sm font-semibold rounded-lg">
          Best Attraction In India
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">
          Elevating Private Jet Rental Experience
        </h2>
        <p className="text-gray-600 mt-3">
          Need to get somewhere in a hurry? Keen to avoid airport queues and long check-ins?
          Private jet charter is the only mode of air travel that allows you to meet every
          business and leisure travel eventually. Private jet hire is easier than you think.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
            <div className="p-3 text-center">
              <h3 className="font-semibold text-lg text-gray-900">{service.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrivateJetRental;
