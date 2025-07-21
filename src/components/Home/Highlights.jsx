"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlane, FaGlobe, FaShieldAlt, FaClock, FaAward, FaUsers } from 'react-icons/fa';

const highlights = [
  {
    title: "Super King Air 200",
    subtitle: "Premium Aircraft Fleet",
    description: "Jet Aviation is led by experts from the aviation industry of India and USA. Our management spearheads a dedicated team, ensuring seamless private air charter solutions for our clients.",
    additionalInfo: "With decades of combined experience, we provide unparalleled service and reliability in private aviation.",
    buttonText: "View Weekly Flight Schedule",
    icon: FaPlane,
    gradient: "from-blue-600 to-indigo-600",
    stats: [
      { icon: FaClock, label: "24/7 Service", value: "Always Available" },
      { icon: FaAward, label: "Safety Rating", value: "5-Star" }
    ]
  },
  {
    title: "Worldwide Reach And Safety",
    subtitle: "Global Aviation Excellence",
    description: "At Jet Serve Aviation Pvt. Ltd., we prioritize safety, reliability, and exceptional customer service with our experienced aviation professionals.",
    additionalInfo: "Our passion for aviation drives us to innovate and exceed industry standards, delivering excellence worldwide.",
    buttonText: "Book Now",
    icon: FaGlobe,
    gradient: "from-emerald-600 to-teal-600",
    stats: [
      { icon: FaShieldAlt, label: "Safety First", value: "100% Secure" },
      { icon: FaUsers, label: "Expert Team", value: "50+ Professionals" }
    ]
  }
];

const AviationHighlights = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-indigo-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-purple-300 rounded-full"></div>
      </div>

      <div className=" px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        {highlights.map((highlight, index) => {
          const IconComponent = highlight.icon;
          const isReversed = index % 2 === 1;
          
          return (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content Section */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`space-y-8 ${isReversed ? 'lg:col-start-2' : ''}`}
              >
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${highlight.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="text-white text-xl" />
                    </div>
                    <span className={`text-sm font-semibold bg-gradient-to-r ${highlight.gradient} bg-clip-text text-transparent uppercase tracking-wider`}>
                      {highlight.subtitle}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {highlight.title}
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.additionalInfo}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6">
                  {highlight.stats.map((stat, statIndex) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={statIndex} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className={`w-10 h-10 bg-gradient-to-r ${highlight.gradient} rounded-xl flex items-center justify-center`}>
                          <StatIcon className="text-white text-sm" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="font-semibold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-r ${highlight.gradient} text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group`}
                >
                  {highlight.buttonText}
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </motion.button>
              </motion.div>

              {/* Image Section */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`relative ${isReversed ? 'lg:col-start-1' : ''}`}
              >
                <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${highlight.gradient} rounded-3xl opacity-10`}></div>
                  
                  {/* Aircraft Images */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative z-10"
                  >
                    <Image
                      src="/1.png"
                      width={180}
                      height={180}
                      className="absolute -top-8 -left-16 transition-transform duration-700 hover:scale-110 hover:rotate-3"
                      alt="Aircraft 1"
                    />
                    <Image
                      src="/2.png"
                      width={220}
                      height={220}
                      className="z-20 relative transition-transform duration-700 hover:scale-110"
                      alt="Main Aircraft"
                    />
                    <Image
                      src="/3.png"
                      width={180}
                      height={180}
                      className="absolute -bottom-8 -right-16 transition-transform duration-700 hover:scale-110 hover:-rotate-3"
                      alt="Aircraft 3"
                    />
                  </motion.div>

                  {/* Floating Elements */}
                  <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center opacity-80">
                    <IconComponent className={`text-2xl bg-gradient-to-r ${highlight.gradient} bg-clip-text text-transparent`} />
                  </div>
                  
                  <div className="absolute bottom-8 left-8 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center opacity-80">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Since</p>
                      <p className="font-bold text-gray-900">2020</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AviationHighlights;