import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiLogIn, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
    setIsOpen(false);
  };

  const menuItems = (
    <>
      {!token ? (
        <>
          <Link
            to="/login"
            className="flex items-center space-x-2 px-4 py-2 rounded-full 
                       bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold 
                       shadow-md hover:scale-105 hover:shadow-lg hover:from-purple-500 hover:to-pink-500 
                       transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FiLogIn size={20} />
            <span>Login</span>
          </Link>

          <Link
            to="/register"
            className="flex items-center space-x-2 px-4 py-2 rounded-full 
                       bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold 
                       shadow-md hover:scale-105 hover:shadow-lg hover:from-pink-500 hover:to-yellow-400 
                       transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <FiUserPlus size={20} />
            <span>Register</span>
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-5 py-2 rounded-full font-semibold text-white 
                     bg-gradient-to-r from-pink-600 to-purple-600 shadow-md 
                     hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-lg 
                     transition-all duration-300"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      )}
    </>
  );

  return (
    <nav className="fixed w-full z-50 top-0 left-0  bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="container mx-auto px-3 md:px-6 xl:px-30 py-2 sm:py-4 flex justify-between items-center">
        <Link to="/" className="font-extrabold text-2xl tracking-wide text-white hover:text-pink-400 transition">
          <img src="/logo.png" alt="logo" className="h-10 sm:h-16" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white/10 backdrop-blur-md pb-4 pt-2`}>
        <div className="flex flex-col items-center space-y-4">
          {menuItems}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
