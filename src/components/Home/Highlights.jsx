// components/AviationHighlights.jsx
import Image from 'next/image';

const AviationHighlights = () => {
  return (
    <div className=" mx-auto py-20 px-4 sm:px-6 md:px-16 space-y-20 bg-white">
      {/* First Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group hover:scale-[1.01] transition-transform duration-500 ease-out">
        <div className="space-y-6 md:pl-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight animate-in fade-in slide-in-from-top-4 duration-600">
            Super King Air 200
          </h2>
          <p className="text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
            Jet Aviation is led by experts from the aviation industry of India and USA. Our management spearheads a dedicated team, ensuring seamless private air charter solutions for our clients.
          </p>
          <p className="text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600 delay-300">
            With decades of combined experience, we provide unparalleled service and reliability in private aviation.
          </p>
          <button className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3 rounded-lg font-medium
            hover:from-gray-800 hover:to-gray-700 transform transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50">
            View Weekly Flight Schedule →
          </button>
        </div>
        <div className="relative h-96 flex items-center justify-center">
          <Image
            src="/1.png"
            width={192} // 48 * 4 (w-48 equivalent)
            height={192}
            className="absolute top-4 left-12 transition-transform duration-500 hover:scale-110"
            alt="Plane 1"
          />
          <Image
            src="/2.png"
            width={224} // 56 * 4 (w-56 equivalent)
            height={224}
            className="z-10 transition-transform duration-500 hover:scale-110"
            alt="Engine"
          />
          <Image
            src="/3.png"
            width={192} // 48 * 4 (w-48 equivalent)
            height={192}
            className="absolute bottom-4 right-12 transition-transform duration-500 hover:scale-110"
            alt="Plane 2"
          />
        </div>
      </div>

      {/* Second Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center group hover:scale-[1.01] transition-transform duration-500 ease-out">
        <div className="space-y-6 md:pl-8">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight animate-in fade-in slide-in-from-top-4 duration-600">
            Worldwide Reach And Safety
          </h2>
          <p className="text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600 delay-200">
            At Jet Serve Aviation Pvt. Ltd., we prioritize safety, reliability, and exceptional customer service with our experienced aviation professionals.
          </p>
          <p className="text-gray-600 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600 delay-300">
            Our passion for aviation drives us to innovate and exceed industry standards, delivering excellence worldwide.
          </p>
          <button className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3 rounded-lg font-medium
            hover:from-gray-800 hover:to-gray-700 transform transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50">
            Book Now →
          </button>
        </div>
        <div className="relative h-96 flex items-center justify-center">
          <Image
            src="/1.png"
            width={192}
            height={192}
            className="absolute top-4 left-12 transition-transform duration-500 hover:scale-110"
            alt="Plane 1"
          />
          <Image
            src="/2.png"
            width={224}
            height={224}
            className="z-10 transition-transform duration-500 hover:scale-110"
            alt="Engine"
          />
          <Image
            src="/3.png"
            width={192}
            height={192}
            className="absolute bottom-4 right-12 transition-transform duration-500 hover:scale-110"
            alt="Plane 2"
          />
        </div>
      </div>
    </div>
  );
};

export default AviationHighlights;