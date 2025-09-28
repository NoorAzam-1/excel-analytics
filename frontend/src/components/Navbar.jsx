import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiLogIn, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

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
            className="flex items-center space-x-2  text-white hover:text-pink-400 transition"
            onClick={() => setIsOpen(false)}
          >
            <FiLogIn size={20} />
            <span>Login</span>
          </Link>
          <Link
            to="/register"
            className="flex items-center space-x-2 text-white hover:text-pink-400 transition"
            onClick={() => setIsOpen(false)}
          >
            <FiUserPlus size={20} />
            <span>Register</span>
          </Link>
        </>
      ) : (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      )}
    </>
  );

  return (
    <nav className="fixed w-full z-50 top-0 left-0 lg:px-22 bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="container mx-auto px-6 py-1 flex justify-between items-center">
        <Link to="/" className="font-extrabold text-2xl tracking-wide text-white hover:text-pink-400 transition">
          <img src='/excelLogo.svg' alt="logo" className='h-18' />        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {menuItems}
        </div>

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



