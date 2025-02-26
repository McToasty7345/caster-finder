import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Caster Finder</h2>
            <p className="text-sm text-gray-400">
              Interactive caster parts reference tool with BOM generation
            </p>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} - All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;