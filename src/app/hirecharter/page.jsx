'use client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const services = [
  {
    title: 'Business Charter',
    description:
      'Seamlessly tailored for executives and professionals, our business charters ensure punctuality, privacy, and productivity at 40,000 feet.',
    link: '/charters/business',
    image: '/1.png',
  },
  {
    title: 'Leisure Charter',
    description:
      'Indulge in stress-free travel to your favorite getaways with our luxury leisure charters, crafted for comfort and convenience.',
    link: '/charters/leisure',
    image: '/2.png',
  },
  {
    title: 'Medical Evacuation',
    description:
      'Fast, safe, and discreet air ambulance services with medically-equipped jets and professional healthcare staff onboard.',
    link: '/charters/medevac',
    image: '/9.png',
  },
  {
    title: 'Group Charter',
    description:
      'Perfect for corporate retreats, destination weddings, or sports teams—our group charters offer space, luxury, and coordination.',
    link: '/charters/group',
    image: '/8.png',
  },
  {
    title: 'VIP Charter',
    description:
      'Fly in absolute privacy and elegance with our VIP charter service, tailored to the lifestyle of high-net-worth individuals and celebrities.',
    link: '/charters/vip',
    image: '/7.png',
  },
  {
    title: 'Cargo Charter',
    description:
      'Efficient, on-demand air cargo solutions for urgent and high-value shipments—delivered with care and precision.',
    link: '/charters/cargo',
    image: '/6.png',
  },
];


export default function HireCharter() {
  return (
    <div className="bg-gray-100 py-20 px-6 text-center mt-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
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