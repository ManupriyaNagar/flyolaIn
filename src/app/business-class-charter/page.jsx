'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BusinessCharter() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-6 md:px-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
        >
          Business Class Charter
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed"
        >
          Jet Serve Aviation’s Business Charter is tailored for executives who value time, privacy, and productivity—delivering a seamless travel experience that aligns with the pace of modern enterprise.
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Fly with Precision and Prestige
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Jet Serve Aviation’s Business Charter offers unmatched efficiency, premium service, and flexible scheduling aboard our state-of-the-art jets. Designed for executives, our charters ensure privacy and productivity, allowing you to focus on what matters most.
          </p>
          <Button
            as="a"
            href="/charters/business"
            className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 text-base font-medium"
          >
            Book a Business Charter
          </Button>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          <img
            src="/6.png"
            alt="Business Class Charter"
            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
          />
        </motion.div>
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-7xl mx-auto mt-16 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Request Your Business Charter
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
                placeholder="Name"
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
    </section>
  );
}