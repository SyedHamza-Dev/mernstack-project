import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          {/* REHAISH Branding */}
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            REH<span className="text-green-500">AI</span>SH
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">About Us</h3>
            <p className="text-gray-400 text-sm">
              REHAISH provides top-notch real estate services to help you find your dream home.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Properties</a></li>
              <li><a href="#" className="hover:text-white transition">Agents</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-1 text-sm">
              <li><span className="text-gray-400">Phone:</span> +1 (123) 456-7890</li>
              <li><span className="text-gray-400">Email:</span> info@rehaish.com</li>
              <li><span className="text-gray-400">Address:</span> 123 Main St, Anytown, USA</li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">Newsletter</h3>
            <p className="text-gray-400 mb-3 text-sm">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-2 py-1 rounded-l-lg focus:outline-none text-sm" 
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-3 py-1 rounded-r-lg hover:bg-blue-600 transition text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between">
          <p className="text-gray-500 text-sm">&copy; 2024 REHAISH. All rights reserved.</p>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
