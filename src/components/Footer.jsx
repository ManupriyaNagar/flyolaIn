import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0B2045] text-white z-10">
      {/* Special Discount Section */}
      

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo & About */}
          <div>
            <img src="/logo-04.png" alt="Flyola Logo" className="h-12" />
            <p className="text-sm mt-4">
              Jet Serve Aviation is a premier provider of private jet services, catering to travelers seeking luxury, comfort, and convenience.
            </p>
            {/* Social Media Icons */}
            {/* <div className="flex space-x-4 mt-4">
              <FaFacebookF className="cursor-pointer hover:text-gray-400" />
              <FaLinkedinIn className="cursor-pointer hover:text-gray-400" />
              <FaInstagram className="cursor-pointer hover:text-gray-400" />
              <FaTwitter className="cursor-pointer hover:text-gray-400" />
              <FaGlobe className="cursor-pointer hover:text-gray-400" />
            </div> */}
          </div>

          {/* Useful Links */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-3">Useful Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-400">Home</a></li>
              <li><a href="#" className="hover:text-gray-400">About Us</a></li>
              <li><a href="#" className="hover:text-gray-400">Blogs</a></li>
              <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-400">Download Ticket</a></li>
            </ul>
          </div> */}

          {/* Legal */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gray-400">Refund Policy</a></li>
              <li><a href="#" className="hover:text-gray-400">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-gray-400">Disclaimer</a></li>
            </ul>
          </div> */}

          {/* Services */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-3">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-400">Personal Charter</a></li>
              <li><a href="#" className="hover:text-gray-400">Hire Charter</a></li>
              <li><a href="#" className="hover:text-gray-400">Business Class Charter</a></li>
              <li><a href="#" className="hover:text-gray-400">Jet Hire</a></li>
              <li><a href="#" className="hover:text-gray-400">Helicopter Hire</a></li>
            </ul>
          </div> */}
        </div>

        {/* Payment Methods */}
        {/* <div className="mt-8">
          <h3 className="font-semibold text-lg mb-3">Payment Methods</h3>
          <div className="flex space-x-4">
            <img src="/1.png" alt="Amex" className="h-6" />
            <img src="/2.png" alt="Google Pay" className="h-6" />
            <img src="/3.png" alt="Apple Pay" className="h-6" />
            <img src="/4.png" alt="Visa" className="h-6" />
          </div>
        </div> */}

      
      </div>

<div className="flex justify-between items-center bg-[#09182C] text-sm py-4 px-6">
      {/* Bottom Footer */}
      <div className="bg-[#09182C] text-center text-sm py-4">
        Jet Serve Aviation Pvt. Ltd © 2025. All Rights Reserved 
      </div>
      <div className="bg-[#09182C] text-center text-sm py-4">
        Powered By RBSH Studio
      </div>
      </div>
    </footer>
  );
};

export default Footer;
