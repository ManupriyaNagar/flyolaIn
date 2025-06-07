'use client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 py-20 px-6">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
        >
          Hire Your Private Charter
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed"
        >
          Jet Serve Aviation redefines luxury air travel with unparalleled comfort and efficiency, offering bespoke travel solutions for business and leisure travelers alike.
        </motion.p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -10 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex"
          >
            <Card className="flex flex-col w-full overflow-hidden shadow-2xl rounded-3xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-indigo-200">
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-base line-clamp-3">
                    {service.description}
                  </p>
                </div>
                <Button
                  as="a"
                  href={service.link}
                  target="_blank"
                  className="mt-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 w-full font-medium"
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Book Your Charter
        </h3>
        <form className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-gray-700 font-medium">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, City, Country"
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departure" className="text-gray-700 font-medium">
                Departure Airport
              </Label>
              <Input
                id="departure"
                type="text"
                placeholder="JFK - John F. Kennedy International"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="arrival" className="text-gray-700 font-medium">
                Arrival Airport
              </Label>
              <Input
                id="arrival"
                type="text"
                placeholder="LAX - Los Angeles International"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-gray-700 font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-gray-700 font-medium">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="mt-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 w-full font-medium text-lg"
          >
            Submit Request
          </Button>
        </form>
      </motion.div>

      {/* View Schedule Button */}

    </div>
  );
}