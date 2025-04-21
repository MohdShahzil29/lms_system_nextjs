import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10 mt-16 rounded-t-2xl shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2">EduPro</h2>
          <p className="text-sm text-gray-200">
            Learn from top instructors and level up your skills from anywhere,
            anytime.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Courses
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Support</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <a href="#" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-gray-300">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-300 mt-8">
        &copy; {new Date().getFullYear()} EduPro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
