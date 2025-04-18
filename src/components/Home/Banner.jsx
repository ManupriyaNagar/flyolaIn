import React from "react";

const services = [
  {
    title: "Personal Charter",
      image: "/1.png",
  },
  {
    title: "Helicopter Hire",
    image: "/2.png",
  },
  {
    title: "Jet Hire",
    image: "/3.png",
  },
  {
    title: "Business Class Charter",
    image: "/4.png",
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

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-14 mx-auto">
        {services.map((service, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={service.image} alt={service.title} className="w-full h-72 object-cover" />
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
