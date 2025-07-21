"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaPlane, FaHelicopter, FaRocket, FaStar } from "react-icons/fa";

const services = [
  {
    title: "Personal Charter",
    image: "/1.png",
    icon: FaPlane,
    description: "Luxury private jets for personal travel",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Helicopter Hire",
    image: "/2.png",
    icon: FaHelicopter,
    description: "Premium helicopter services",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Jet Hire",
    image: "/3.png",
    icon: FaRocket,
    description: "High-performance jet rentals",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Business Class Charter",
    image: "/4.png",
    icon: FaStar,
    description: "Executive business travel solutions",
    gradient: "from-orange-500 to-red-600",
  },
];

const PrivateJetRental = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-indigo-300 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border border-purple-300 rounded-full"></div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 text-sm font-bold rounded-full shadow-lg mb-6">
            <FaStar className="text-yellow-600" />
            Premium Aviation Services
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Elevating Private Jet 
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Rental Experience</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Need to get somewhere in a hurry? Keen to avoid airport queues and long check-ins?
            Private jet charter is the only mode of air travel that allows you to meet every
            business and leisure travel need. Private jet hire is easier than you think.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-64 sm:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon Overlay */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className="text-white text-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Learn More Link */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button className={`text-sm font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent hover:underline`}>
                        Learn More →
                      </button>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Experience Luxury Aviation?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Contact our aviation specialists today and discover how we can elevate your travel experience
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Get Quote Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivateJetRental;
