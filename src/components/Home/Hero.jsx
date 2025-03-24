import React from "react";

const Hero = () => {
  return (
    <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/private-jet.jpg')" }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
          GET THE BEST & PREMIUM <br /> IN AVIATION INDUSTRY
        </h1>
        <button className="mt-6 px-6 py-3 bg-white text-gray-900 font-semibold text-lg rounded-lg shadow-md hover:bg-gray-200 transition">
          Request A Call
        </button>
      </div>
    </section>
  );
};

export default Hero;
