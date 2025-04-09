"use client"
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const services = [
  {
    title: "Luxurious Fleet",
    description:
      "Our fleet comprises state-of-the-art private jets equipped with luxurious amenities and cutting-edge technology, ensuring a comfortable and enjoyable journey.",
    image: "/1.png",
  },
  {
    title: "Personalized Service",
    description:
      "We understand that every traveler is unique, which is why we offer personalized service to cater to your specific preferences and requirements. From in-flight dining options to customized itineraries, we strive to exceed your expectations.",
    image: "/2.png",
  },
  {
    title: "Flexible Scheduling",
    description:
      "With Jet Serve Aviation, you have the flexibility to fly according to your schedule. Whether it's a last-minute business trip or a leisurely getaway, our team works around the clock to accommodate your travel needs.",
    image: "/3.png",
  },
];

export default function PersonalCharter() {
  return (
    <div className="bg-gray-100 py-16 px-6 text-center mt-20">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Personal Charter</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
        Jet Serve Aviation redefines luxury air travel with unparalleled comfort and efficiency, offering bespoke travel solutions for business and leisure travelers alike.
      </p>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden shadow-lg rounded-2xl">
              <img src={service.image} alt={service.title} className="w-full h-56 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Contact us
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button className="mt-10 bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900">
        View Weekly Flight Schedule
      </Button>
    </div>
  );
}
