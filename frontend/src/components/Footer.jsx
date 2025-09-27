import React from 'react';

const Footer = () => (
  <footer className="mt-auto pt-20 pb-12 text-center text-white/90 bg-gradient-to-br from-gray-900 via-zinc-900 to-gray-950 select-none">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to elevate your data?</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto text-white/70">
        Unlock the full potential of your business with our cutting-edge analytics solutions.
      </p>
      <a href="/" className="inline-block px-8 py-3 rounded-full text-white font-semibold bg-gray-700 hover:bg-gray-600 transition-colors">
        Get Started
      </a>
      <hr className="mt-12 mb-6 border-white/20 max-w-sm mx-auto" />
      <p className="text-sm font-light">&copy; {new Date().getFullYear()} Excel Analytics. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;