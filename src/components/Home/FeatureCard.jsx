import React from "react";
import { FaMoneyBillWave, FaUmbrellaBeach, FaSuitcaseRolling, FaHeadset } from "react-icons/fa";

const features = [
  {
    icon: <FaMoneyBillWave className="text-red-500 text-4xl" />,
    title: "Easy Booking",
    description:
      "Flylola offers easy booking with a user-friendly interface, seamless process, and quick confirmations, ensuring a hassle-free experience for travelers.",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    icon: <FaUmbrellaBeach className="text-red-500 text-4xl" />,
    title: "Best Destinations",
    description:
      "We offer the best destinations for travel enthusiasts, ensuring unforgettable experiences with top-notch services and easy booking to exotic locales.",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    icon: <FaSuitcaseRolling className="text-red-500 text-4xl" />,
    title: "Travel Guides",
    description:
      "Discover the world effortlessly with Flylola’s comprehensive travel guides, offering expert tips, local insights, and must-visit destinations for your perfect journey.",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
  {
    icon: <FaHeadset className="text-red-500 text-4xl" />,
    title: "Friendly Support",
    description:
      "We offer exceptional friendly support, ensuring your travel needs are met with prompt, personalized assistance and a smile, every step of the way.",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-12">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`${feature.bgColor} p-6 rounded-2xl shadow-md`}
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className={`text-xl font-bold ${feature.textColor} mb-2`}>
            {feature.title}
          </h3>
          <p className="text-gray-700">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
