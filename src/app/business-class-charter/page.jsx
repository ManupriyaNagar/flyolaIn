'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function BusinessCharter() {
  return (
    
    <section className="bg-gray-100 py-12 px-6 md:px-12">
      <div className="bg-gray-100  px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-4">Business Class Charter</h2>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
    Jet Serve Aviation’s Business Charter is tailored for executives who value time, privacy, and productivity—delivering a seamless travel experience that aligns with the pace of modern enterprise.
    </p>
    </div>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Business Class Charter
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Jet Serve Aviation’s Business Charter is tailored for executives who value time,
            privacy, and productivity—delivering a seamless travel experience that aligns
            with the pace of modern enterprise. Enjoy unparalleled efficiency, premium service,
            and flexible scheduling aboard our state-of-the-art jets.
          </p>
          <Button
            as="a"
            href="/charters/business"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-base font-medium"
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
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src="/6.png"
            alt="Business Class Charter"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
