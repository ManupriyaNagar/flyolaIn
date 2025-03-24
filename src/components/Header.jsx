import Image from "next/image";

export default function Header() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-blue-200">
      {/* Header */}
      <header className="w-full bg-white text-black shadow-lg rounded-full flex justify-between items-center p-4 px-8 fixed top-4 max-w-6xl mx-auto border border-gray-200">
        {/* Logo */}
        <div className="flex items-center">
          <Image src="/logo.png" alt="Flyola Logo" width={120} height={60} className="cursor-pointer" />
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {['Personal Charter', 'Hire Charter', 'Business Class Charter', 'Jet Hire', 'Helicopter Hire', 'Download Tickets'].map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className="hover:text-blue-500 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>
        
        {/* Sign In Button */}
        <button className="border px-4 py-2 rounded-full flex items-center shadow-md hover:bg-gray-100 transition-all duration-200 text-sm font-medium">
          🔑 Sign In / Register
        </button>
      </header>
    </div>
  );
}