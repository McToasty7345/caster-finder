import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePartContext } from '../context/PartContext';

const Navbar = () => {
  const location = useLocation();
  const { bomItems } = usePartContext();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };
  
  const isAdminActive = () => {
    return location.pathname.startsWith('/admin') ? 'bg-blue-700' : '';
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* Logo */}
            <div>
              <Link to="/" className="flex items-center py-5 px-2 text-white">
                <span className="font-bold text-xl">Caster Finder</span>
              </Link>
            </div>
            
            {/* Primary Nav (desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`py-5 px-3 hover:bg-blue-700 ${isActive('/')}`}>
                Dashboard
              </Link>
              <Link to="/catalog" className={`py-5 px-3 hover:bg-blue-700 ${isActive('/catalog')}`}>
                Parts Catalog
              </Link>
              <Link to="/bom-builder" className={`py-5 px-3 hover:bg-blue-700 ${isActive('/bom-builder')}`}>
                BOM Builder {bomItems.length > 0 && `(${bomItems.length})`}
              </Link>
              <Link to="/add-part" className={`py-5 px-3 hover:bg-blue-700 ${isActive('/add-part')}`}>
                Add Part
              </Link>
              <Link to="/admin" className={`py-5 px-3 hover:bg-blue-700 ${isAdminActive()}`}>
                Admin
              </Link>
            </div>
          </div>
          
          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-button">
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <Link to="/" className={`block py-2 px-4 text-sm hover:bg-blue-700 ${isActive('/')}`}>
          Dashboard
        </Link>
        <Link to="/catalog" className={`block py-2 px-4 text-sm hover:bg-blue-700 ${isActive('/catalog')}`}>
          Parts Catalog
        </Link>
        <Link to="/bom-builder" className={`block py-2 px-4 text-sm hover:bg-blue-700 ${isActive('/bom-builder')}`}>
          BOM Builder {bomItems.length > 0 && `(${bomItems.length})`}
        </Link>
        <Link to="/add-part" className={`block py-2 px-4 text-sm hover:bg-blue-700 ${isActive('/add-part')}`}>
          Add Part
        </Link>
        <Link to="/admin" className={`block py-2 px-4 text-sm hover:bg-blue-700 ${isAdminActive()}`}>
          Admin
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;