'use client'
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];
export default function HireCharter() {
  return (
    <div className="bg-gray-100 py-16 px-6 text-center mt-20">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Hire Charter</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
        Jet Serve Aviation redefines luxury air travel with unparalleled comfort and efficiency, offering bespoke travel solutions for business and leisure travelers alike.
      </p>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden shadow-lg rounded-2xl">
              <img src={project.image} alt={project.title} className="w-full h-56 object-cover" />
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
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
