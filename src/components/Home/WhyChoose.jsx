import React from "react";

const features = [
  {
    id: "01",
    title: "Exceptional Customer Service",
    description:
      "Flyola prides itself on providing exceptional customer service from the moment you book your ticket until you reach your destination.",
    color: "bg-green-500",
  },
  {
    id: "02",
    title: "Easy Booking Process",
    description:
      "At Flyola, we understand that convenience is key. Our user-friendly website and mobile app make the booking process quick and straightforward.",
    color: "bg-yellow-500",
  },
  {
    id: "03",
    title: "Competitive Pricing",
    description:
      "Flyola offers competitive pricing without compromising on quality. We strive to provide the best value for your money, with regular promotions.",
    color: "bg-purple-500",
  },
  {
    id: "04",
    title: "Comfort and Convenience",
    description:
      "For those who value extra comfort, Flyola’s premium class offers additional perks such as priority boarding, extra baggage allowance, and access to exclusive lounges.",
    color: "bg-red-500",
  },
];

const WhyChooseFlyola = () => {
  return (
    <div className="p-10 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-900">Why Choose Flyola</h2>
      <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
        When it comes to air travel, Flyola stands out as a premier choice for travelers
        seeking a seamless, comfortable, and enjoyable journey. Here are compelling
        reasons why choosing Flyola is the best decision for your next trip:
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center mt-10">
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img
            src="/1.png"
            alt="Private Jet"
            className="w-40 h-56 md:w-60 md:h-80 object-cover rounded-full border-4 border-white shadow-lg"
          />
          <img
            src="/2.png"
            alt="Helicopter"
            className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-lg absolute bottom-0 right-0"
          />
        </div>

        {/* Features Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 px-4 md:pl-10">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-4">
              <div
                className={`text-white font-bold text-lg px-3 py-1 rounded-full ${feature.color}`}
              >
                {feature.id}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseFlyola;
