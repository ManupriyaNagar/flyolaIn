'use client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const services = [
  {
    title: 'Stripe',
    description:
      'A technology company that builds economic infrastructure for the internet.',
    link: 'https://stripe.com',
    image: '/1.png',
  },
  {
    title: 'Netflix',
    description:
      'A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more.',
    link: 'https://netflix.com',
    image: '/2.png',
  },
  {
    title: 'Google',
    description:
      'A multinational technology company that specializes in Internet-related services and products.',
    link: 'https://google.com',
    image: '/3.png',
  },
  {
    title: 'Meta',
    description:
      'A technology company that focuses on building products that advance Facebook’s mission of bringing the world closer together.',
    link: 'https://meta.com',
    image: '/4.png',
  },
  {
    title: 'Amazon',
    description:
      'A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    link: 'https://amazon.com',
    image: '/1.png',
  },
  {
    title: 'Microsoft',
    description:
      'A multinational technology company that develops, manufactures, licenses, supports, and sells computer software and services.',
    link: 'https://microsoft.com',
    image: '/1.png',
  },
];

export default function HireCharter() {
  return (
    <div className="bg-gray-50 py-20 px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
        Hire Charter
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
        Jet Serve Aviation redefines luxury air travel with unparalleled comfort and efficiency, offering bespoke travel solutions for business and leisure travelers alike.
      </p>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, y: -5 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex" // Ensures card stretches to fill container
          >
            <Card className="flex flex-col w-full overflow-hidden shadow-xl rounded-2xl bg-white border border-gray-100">
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {service.description}
                  </p>
                </div>
                <Button
                  as="a"
                  href={service.link}
                  target="_blank"
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 w-full"
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button className="mt-12 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-lg font-medium">
        View Weekly Flight Schedule
      </Button>
    </div>
  );
}